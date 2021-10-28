/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createBaseEntity } from '@scrapper-gate/shared/common';
import {
  createMockScrapper,
  createMockScrapperRun,
  createMockScrapperStep,
} from '@scrapper-gate/shared/domain/scrapper/mocks';
import { ScrapperRunError } from '@scrapper-gate/shared/errors';
import { logger } from '@scrapper-gate/shared/logger/console';
import {
  RunState,
  ScrapperAction,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { createMockProxy } from 'jest-mock-proxy';
import { ScrapperRunProcessor } from './ScrapperRunProcessor';
import { ScrapperRunner } from './types';

async function setupRun() {
  const stepOnTrue: ScrapperStep = {
    ...(await createMockScrapperStep({})),
    action: ScrapperAction.Click,
  };
  const stepOnFalse: ScrapperStep = {
    ...(await createMockScrapperStep({})),
    action: ScrapperAction.Click,
  };
  const conditionalStep: ScrapperStep = {
    ...(await createMockScrapperStep({})),
    action: ScrapperAction.Condition,
    stepOnTrue,
    stepOnFalse,
    conditionalRules: [],
    isFirst: true,
  };

  const steps = [
    {
      ...(await createMockScrapperStep({})),
      action: ScrapperAction.Click,
      nextStep: conditionalStep,
    },
    conditionalStep,
    stepOnTrue,
    stepOnFalse,
  ];

  const initialScrapperRun = createMockScrapperRun(steps);

  initialScrapperRun.state = RunState.InProgress;

  const scrapper = createMockScrapper();
  scrapper.steps = steps;

  return { stepOnTrue, stepOnFalse, initialScrapperRun, scrapper };
}

async function setupConditionSteps() {
  const firstStep = await createMockScrapperStep({
    intercept: (step) => {
      step.action = ScrapperAction.Condition;
      step.isFirst = true;

      return step;
    },
  });
  const stepOnTrue = await createMockScrapperStep({
    intercept: (step) => {
      step.action = ScrapperAction.ReadText;

      return step;
    },
  });
  const stepOnFalse = await createMockScrapperStep({
    intercept: (step) => {
      step.action = ScrapperAction.ReadText;

      return step;
    },
  });
  return { firstStep, stepOnTrue, stepOnFalse };
}

describe('Scrapper run processor', () => {
  it('should process run - true condition', async () => {
    const runner = createMockProxy<ScrapperRunner>();

    const { stepOnTrue, stepOnFalse, initialScrapperRun } = await setupRun();

    const processor = new ScrapperRunProcessor(
      runner,
      logger,
      initialScrapperRun
    );

    runner.Click.mockResolvedValue({
      values: [],
      performance: {
        duration: 25,
      },
    });

    runner.Condition.mockResolvedValue({
      result: true,
      performance: {
        duration: 25,
      },
    });

    const { scrapperRun } = await processor.process();

    expect(scrapperRun).toBeDefined();
    expect(scrapperRun.state).toEqual(RunState.Completed);
    expect(
      runner.Click.mock.calls.find((call) => call[0].step.id === stepOnTrue.id)
    ).toBeDefined();

    expect(
      runner.Click.mock.calls.find((call) => call[0].step.id === stepOnFalse.id)
    ).toBeUndefined();
  });

  it('should process run - false condition', async () => {
    const runner = createMockProxy<ScrapperRunner>();

    const { stepOnTrue, stepOnFalse, initialScrapperRun } = await setupRun();

    const processor = new ScrapperRunProcessor(
      runner,
      logger,
      initialScrapperRun
    );

    runner.Click.mockResolvedValue({
      values: [],
      performance: {
        duration: 25,
      },
    });

    runner.Condition.mockResolvedValue({
      result: false,
      performance: {
        duration: 25,
      },
    });

    await processor.process();

    expect(
      runner.Click.mock.calls.find((call) => call[0].step.id === stepOnTrue.id)
    ).toBeUndefined();

    expect(
      runner.Click.mock.calls.find((call) => call[0].step.id === stepOnFalse.id)
    ).toBeDefined();
  });

  it('should handle errors', async () => {
    const runner = createMockProxy<ScrapperRunner>();

    const { initialScrapperRun } = await setupRun();
    const processor = new ScrapperRunProcessor(
      runner,
      logger,
      initialScrapperRun
    );

    runner.Click.mockImplementation(async () => {
      throw new ScrapperRunError({
        url: 'http://example.org',
        performance: {
          duration: 25,
        },
        browserVersion: '1.0',
        message: 'Error!',
      });
    });

    const { scrapperRun } = await processor.process();

    expect(scrapperRun.error).toBeDefined();
  });

  it('should set correct state for handled steps', async () => {
    const firstStep = await createMockScrapperStep({
      intercept: (step) => {
        step.action = ScrapperAction.Click;
        step.isFirst = true;

        return step;
      },
    });
    const secondStep = await createMockScrapperStep({
      intercept: (step) => {
        step.action = ScrapperAction.ReadText;

        return step;
      },
    });

    firstStep.nextStep = secondStep;

    const steps = [firstStep, secondStep];

    const scrapper = createMockScrapper();

    scrapper.steps = steps;

    const scrapperRun = createMockScrapperRun(steps);

    const runner = createMockProxy<ScrapperRunner>();

    runner.Click.mockResolvedValue({
      values: [],
      performance: {
        duration: 25,
      },
    });

    runner.ReadText.mockResolvedValue({
      values: [],
      performance: {
        duration: 25,
      },
    });

    const processor = new ScrapperRunProcessor(runner, logger, scrapperRun);

    await processor.process();

    expect(scrapperRun.results).toHaveLength(steps.length);

    scrapperRun.results!.forEach((result) => {
      expect(result.state).toEqual(RunState.Completed);
    });
  });

  it('should mark skipped steps from condition as skipped - true case', async () => {
    const { firstStep, stepOnTrue, stepOnFalse } = await setupConditionSteps();
    const stepAfterFalse = await createMockScrapperStep({});

    stepOnFalse.nextStep = stepAfterFalse;
    firstStep.stepOnTrue = stepOnTrue;
    firstStep.stepOnFalse = stepOnFalse;

    const steps = [firstStep, stepOnTrue, stepOnFalse, stepAfterFalse];

    const scrapper = createMockScrapper();

    scrapper.steps = steps;

    const scrapperRun = createMockScrapperRun(steps);

    const runner = createMockProxy<ScrapperRunner>();

    runner.Click.mockResolvedValue({
      values: [],
      performance: {
        duration: 25,
      },
    });

    runner.ReadText.mockResolvedValue({
      values: [],
      performance: {
        duration: 25,
      },
    });

    runner.Condition.mockResolvedValue({
      result: true,
      performance: {
        duration: 25,
      },
    });

    const processor = new ScrapperRunProcessor(runner, logger, scrapperRun);

    await processor.process();

    const skippedSteps = scrapperRun.results!.filter((result) =>
      [stepOnFalse.id, stepAfterFalse.id].includes(result.step.id)
    );
    const trueResult = scrapperRun.results!.find(
      (result) => result.step.id === stepOnTrue.id
    );

    expect(skippedSteps).toHaveLength(2);

    skippedSteps.forEach((step) => {
      expect(step.state).toEqual(RunState.Skipped);
    });

    expect(trueResult?.state).toEqual(RunState.Completed);
  });

  it('should mark skipped steps from condition as skipped - false case', async () => {
    const { stepOnTrue, stepOnFalse, firstStep } = await setupConditionSteps();

    firstStep.stepOnTrue = stepOnTrue;
    firstStep.stepOnFalse = stepOnFalse;

    const steps = [firstStep, stepOnTrue, stepOnFalse];

    const scrapper = createMockScrapper();

    scrapper.steps = steps;

    const scrapperRun = createMockScrapperRun(steps);

    const runner = createMockProxy<ScrapperRunner>();

    runner.Click.mockResolvedValue({
      values: [],
      performance: {
        duration: 25,
      },
    });

    runner.ReadText.mockResolvedValue({
      values: [],
      performance: {
        duration: 25,
      },
    });

    runner.Condition.mockResolvedValue({
      result: false,
      performance: {
        duration: 25,
      },
    });

    const processor = new ScrapperRunProcessor(runner, logger, scrapperRun);

    await processor.process();

    const falseResult = scrapperRun.results!.find(
      (result) => result.step.id === stepOnFalse.id
    );
    const trueResult = scrapperRun.results!.find(
      (result) => result.step.id === stepOnTrue.id
    );

    expect(trueResult?.state).toEqual(RunState.Skipped);
    expect(falseResult?.state).toEqual(RunState.Completed);
  });

  it('should add variables from finished steps', async () => {
    const typeStep: ScrapperStep = {
      ...(await createMockScrapperStep({})),
      action: ScrapperAction.Type,
      key: 'readText',
      typeValue: '{{readText}}',
    };
    const clickStep: ScrapperStep = {
      ...(await createMockScrapperStep({})),
      action: ScrapperAction.Click,
      selectors: [
        {
          value: '{{readText}}',
        },
      ],
      nextStep: typeStep,
    };
    const readStep: ScrapperStep = {
      ...(await createMockScrapperStep({})),
      action: ScrapperAction.ReadText,
      key: 'readText',
      nextStep: clickStep,
      isFirst: true,
    };

    const steps = [readStep, clickStep, typeStep];

    const runner = createMockProxy<ScrapperRunner>();

    const { initialScrapperRun, scrapper } = await setupRun();
    const processor = new ScrapperRunProcessor(
      runner,
      logger,
      initialScrapperRun
    );

    scrapper.steps = steps;
    initialScrapperRun.steps = steps;
    initialScrapperRun.results = steps.map((step) => ({
      ...createBaseEntity(),
      step,
      state: RunState.Pending,
    }));

    runner.ReadText.mockResolvedValue({
      performance: {
        duration: 0,
      },
      values: [
        {
          value: '#div',
        },
        {
          value: 'span',
        },
      ],
    });

    runner.Click.mockResolvedValue({
      performance: {
        duration: 5,
      },
      values: [],
    });

    runner.Type.mockResolvedValue({
      performance: {
        duration: 5,
      },
      values: [],
    });

    await processor.process();

    const clickCall = runner.Click.mock.calls[0];
    const typeCall = runner.Type.mock.calls[0];

    expect(clickCall[0].step.selectors).toEqual([
      {
        value: '#div,span',
      },
    ]);

    expect(typeCall[0].step.typeValue).toEqual('#div,span');
  });
});
