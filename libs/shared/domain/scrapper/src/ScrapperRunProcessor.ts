import {
  createBaseEntity,
  Disposable,
  findFirstNode,
} from '@scrapper-gate/shared/common';
import { AppError, ScrapperRunError } from '@scrapper-gate/shared/errors';
import {
  ErrorObject,
  RunState,
  ScrapperAction,
  ScrapperRun,
  ScrapperRunStepResult,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { Typed } from 'emittery';
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
      while (step) {
        const { nextStep } = await this.runStep(step, scrapperRun);

        step = nextStep;
      }
    } catch (error) {
      const {
        error: errorObject,
        stepResult,
      } = ScrapperRunProcessor.createStepResultFromError(error, step);

      scrapperRun.results.push(stepResult);
      scrapperRun.error = {
        ...errorObject,
        stepId: step.id,
      };

      await this.events.emit('onError', {
        step,
        error,
      });
    }

    scrapperRun.endedAt = new Date();
    scrapperRun.state = RunState.Completed;

    await this.events.emit('onScrapperRunChange', scrapperRun);

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

  private static createStepResultFromError(error: Error, step: ScrapperStep) {
    const errorObject: ErrorObject = {
      name: error.name,
      message: error.message,
      date: error instanceof AppError ? error.date : new Date(),
    };

    const stepResult: ScrapperRunStepResult = {
      ...createBaseEntity(),
      step,
      error: errorObject,
      performance:
        error instanceof ScrapperRunError
          ? error.performance
          : {
              duration: 0,
            },
    };

    return {
      error: errorObject,
      stepResult,
    };
  }

  private static createStepResult(
    result: RunScrapperStepResult,
    step: ScrapperStep
  ): ScrapperRunStepResult {
    return {
      ...createBaseEntity(),
      values: result.values?.map((value) => ({
        ...createBaseEntity(),
        ...value,
      })),
      performance: result.performance,
      step,
    };
  }

  async dispose() {
    await this.runner.dispose();

    this.events.clearListeners();
  }
}
