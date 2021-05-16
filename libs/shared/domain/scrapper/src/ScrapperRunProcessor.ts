import { Disposable, findFirstNode } from '@scrapper-gate/shared/common';
import { ScrapperRunError } from '@scrapper-gate/shared/errors';
import {
  RunState,
  ScrapperAction,
  ScrapperRun,
  ScrapperRunStepResult,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { Typed } from 'emittery';
import { v4 } from 'uuid';
import {
  ConditionalRunScrapperStepResult,
  RunScrapperStepResult,
  ScrapperRunner,
} from './types';

export interface ProcessParams {
  scrapperRun: ScrapperRun;
}

export class ScrapperRunProcessor implements Disposable {
  constructor(private readonly runner: ScrapperRunner) {}

  readonly events = new Typed<{
    onScrapperRunChange: ScrapperRun;
    onStepFinish: RunScrapperStepResult;
    onError: {
      error: Error;
      step: ScrapperStep;
    };
  }>();

  async process({ scrapperRun }: ProcessParams) {
    await this.runner.initialize?.();

    scrapperRun.state = RunState.InProgress;
    scrapperRun.startedAt = new Date();

    if (!Array.isArray(scrapperRun.results)) {
      scrapperRun.results = [];
    }

    await this.events.emit('onScrapperRunChange', scrapperRun);

    let step = findFirstNode(scrapperRun.steps);

    try {
      do {
        const { nextStep } = await this.runStep(step, scrapperRun);

        step = nextStep;
      } while (step);
    } catch (error) {
      scrapperRun.results.push(
        ScrapperRunProcessor.createStepResultFromError(error, step)
      );

      await this.events.emit('onError', {
        step,
        error,
      });
    }

    scrapperRun.endedAt = new Date();

    return {
      scrapperRun,
    };
  }

  private async runStep(step: ScrapperStep, scrapperRun: ScrapperRun) {
    const runResult = await this.runner[step.action]({
      scrapperRun,
      step,
      variables: {},
    });

    scrapperRun.results.push(
      ScrapperRunProcessor.createStepResult(runResult, step)
    );

    await Promise.all([
      this.events.emit('onStepFinish', runResult),
      this.events.emit('onScrapperRunChange', scrapperRun),
    ]);

    let nextStepId: string | null = null;

    if (step.action !== ScrapperAction.Condition) {
      nextStepId = step.nextStep?.id;
    } else {
      nextStepId = (runResult as ConditionalRunScrapperStepResult).result
        ? step.stepOnTrue?.id
        : step.stepOnFalse?.id;
    }

    const nextStep = nextStepId
      ? scrapperRun.steps.find(
          (scrapperRunStep) => scrapperRunStep.id === nextStepId
        )
      : null;

    return {
      nextStep,
    };
  }

  private static createStepResultFromError(
    error: Error,
    step: ScrapperStep
  ): ScrapperRunStepResult {
    return {
      step,
      id: v4(),
      error: {
        name: error.name,
        message: error.message,
        date: new Date(),
      },
      performance:
        error instanceof ScrapperRunError
          ? error.performance
          : {
              duration: 0,
            },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private static createStepResult(
    result: RunScrapperStepResult,
    step: ScrapperStep
  ): ScrapperRunStepResult {
    return {
      values: result.values,
      performance: result.performance,
      id: v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      step,
    };
  }

  async dispose() {
    await this.runner.dispose();

    this.events.clearListeners();
  }
}
