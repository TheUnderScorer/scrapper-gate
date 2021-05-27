import { ScrapperRunError } from '@scrapper-gate/shared/errors';
import {
  RunState,
  ScrapperAction,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { createMockProxy } from 'jest-mock-proxy';
import { v4 } from 'uuid';
import { createMockScrapper } from './mockScrapper';
import { createMockScrapperStep } from './mockScrapperStep';
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
  };

  const initialScrapperRun = {
    id: v4(),
    updatedAt: new Date(),
    createdAt: new Date(),
    state: RunState.InProgress,
    steps: [
      {
        ...(await createMockScrapperStep({})),
        action: ScrapperAction.Click,
        nextStep: conditionalStep,
      },
      conditionalStep,
      stepOnTrue,
      stepOnFalse,
    ],
  };

  const scrapper = createMockScrapper();
  scrapper.steps = initialScrapperRun.steps;

  return { stepOnTrue, stepOnFalse, initialScrapperRun, scrapper };
}

describe('Scrapper run processor', () => {
  it('should process run - true condition', async () => {
    const runner = createMockProxy<ScrapperRunner>();

    const processor = new ScrapperRunProcessor(runner);
    const {
      stepOnTrue,
      stepOnFalse,
      initialScrapperRun,
      scrapper,
    } = await setupRun();

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

    const { scrapperRun } = await processor.process({
      scrapperRun: initialScrapperRun,
      scrapper,
    });

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

    const processor = new ScrapperRunProcessor(runner);
    const {
      stepOnTrue,
      stepOnFalse,
      initialScrapperRun,
      scrapper,
    } = await setupRun();

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

    await processor.process({
      scrapperRun: initialScrapperRun,
      scrapper,
    });

    expect(
      runner.Click.mock.calls.find((call) => call[0].step.id === stepOnTrue.id)
    ).toBeUndefined();

    expect(
      runner.Click.mock.calls.find((call) => call[0].step.id === stepOnFalse.id)
    ).toBeDefined();
  });

  it('should handle errors', async () => {
    const runner = createMockProxy<ScrapperRunner>();

    const processor = new ScrapperRunProcessor(runner);
    const { initialScrapperRun, scrapper } = await setupRun();

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

    const { scrapperRun } = await processor.process({
      scrapperRun: initialScrapperRun,
      scrapper,
    });

    expect(scrapperRun.error).toBeDefined();
  });

  it('should handle variables', async () => {
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
    };

    const steps = [readStep, clickStep, typeStep];

    const runner = createMockProxy<ScrapperRunner>();

    const processor = new ScrapperRunProcessor(runner);
    const { initialScrapperRun, scrapper } = await setupRun();

    scrapper.steps = steps;
    initialScrapperRun.steps = steps;

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

    await processor.process({
      scrapper,
      scrapperRun: initialScrapperRun,
    });

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
