import { ScrapperRunError } from '@scrapper-gate/shared/errors';
import {
  RunState,
  ScrapperAction,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { createMockProxy } from 'jest-mock-proxy';
import { v4 } from 'uuid';
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
  return { stepOnTrue, stepOnFalse, initialScrapperRun };
}

describe('Scrapper run processor', () => {
  it('should process run - true condition', async () => {
    const runner = createMockProxy<ScrapperRunner>();

    const processor = new ScrapperRunProcessor(runner);
    const { stepOnTrue, stepOnFalse, initialScrapperRun } = await setupRun();

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
    });

    expect(scrapperRun).toBeDefined();
    expect(scrapperRun.state).toEqual(RunState.Completed);
    expect(runner.Click).toHaveBeenCalledWith({
      step: stepOnTrue,
      scrapperRun,
      variables: {},
    });
    expect(runner.Click).not.toHaveBeenCalledWith({
      step: stepOnFalse,
      scrapperRun,
      variables: {},
    });
  });

  it('should process run - false condition', async () => {
    const runner = createMockProxy<ScrapperRunner>();

    const processor = new ScrapperRunProcessor(runner);
    const { stepOnTrue, stepOnFalse, initialScrapperRun } = await setupRun();

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

    const { scrapperRun } = await processor.process({
      scrapperRun: initialScrapperRun,
    });

    expect(runner.Click).not.toHaveBeenCalledWith({
      step: stepOnTrue,
      scrapperRun,
      variables: {},
    });
    expect(runner.Click).toHaveBeenCalledWith({
      step: stepOnFalse,
      scrapperRun,
      variables: {},
    });
  });

  it('should handle errors', async () => {
    const runner = createMockProxy<ScrapperRunner>();

    const processor = new ScrapperRunProcessor(runner);
    const { initialScrapperRun } = await setupRun();

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
    });

    expect(scrapperRun.error).toBeDefined();
  });
});
