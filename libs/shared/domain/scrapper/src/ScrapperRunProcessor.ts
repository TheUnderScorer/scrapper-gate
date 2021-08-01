/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createBaseEntity,
  Disposable,
  findFirstNode,
  Maybe,
} from '@scrapper-gate/shared/common';
import { resolveVariables } from '@scrapper-gate/shared/domain/variables';
import { AppError, ScrapperRunError } from '@scrapper-gate/shared/errors';
import { Logger } from '@scrapper-gate/shared/logger';
import {
  ErrorObject,
  RunState,
  Scrapper,
  ScrapperAction,
  ScrapperRun,
  ScrapperRunStepResult,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { Typed } from 'emittery';
import { createScrapperRunVariables } from './createScrapperRunVariables';
import {
  ConditionalRunScrapperStepResult,
  InitialiseScrapperRunnerParams,
  RunScrapperStepResult,
  ScrapperRunner,
} from './types';

export interface ProcessParams extends InitialiseScrapperRunnerParams {
  scrapperRun: ScrapperRun;
  scrapper: Scrapper;
}

export class ScrapperRunProcessor implements Disposable {
  constructor(
    private readonly runner: ScrapperRunner,
    private readonly logger: Logger
  ) {}

  readonly events = new Typed<{
    scrapperRunChanged: ScrapperRun;
    stepFinished: RunScrapperStepResult;
    error: {
      error: Error;
      step: ScrapperStep;
    };
  }>();

  async process({ scrapperRun, scrapper, ...rest }: ProcessParams) {
    let failed = false;

    if (!scrapperRun.steps?.length) {
      return {
        scrapperRun,
      };
    }

    await this.runner.initialize?.(rest);

    scrapperRun.state = RunState.InProgress;
    scrapperRun.startedAt = new Date();

    if (!Array.isArray(scrapperRun.results)) {
      scrapperRun.results = [];
    }

    await this.events.emit('scrapperRunChanged', scrapperRun);

    let step = findFirstNode(scrapperRun.steps);

    try {
      while (step) {
        const { nextStep } = await this.runStep(step, scrapperRun, scrapper);

        step = nextStep!;
      }
    } catch (error) {
      this.logger.error(`Step ${step?.id} failed: ${error.message}`);

      const { error: errorObject, stepResult } =
        ScrapperRunProcessor.createStepResultFromError(error, step!);

      scrapperRun.results.push(stepResult);
      scrapperRun.error = {
        ...errorObject,
        stepId: step!.id,
      };

      await this.events.emit('error', {
        step: step!,
        error,
      });

      failed = true;
    }

    scrapperRun.endedAt = new Date();
    scrapperRun.state = failed ? RunState.Failed : RunState.Completed;

    await this.events.emit('scrapperRunChanged', scrapperRun);

    this.logger.info(`Run ${scrapperRun.id} finished.`);

    return {
      scrapperRun,
    };
  }

  private async runStep(
    step: ScrapperStep,
    scrapperRun: ScrapperRun,
    scrapper: Scrapper
  ) {
    const variables = createScrapperRunVariables(scrapper, scrapperRun);

    const preparedStep = resolveVariables({
      target: step,
      variables,
    });
    const runResult = await this.runner[step.action!]({
      scrapperRun,
      step: preparedStep,
      variables,
    });

    scrapperRun.results!.push(
      ScrapperRunProcessor.createStepResult(runResult, step)
    );

    await Promise.all([
      this.events.emit('stepFinished', runResult),
      this.events.emit('scrapperRunChanged', scrapperRun),
    ]);

    let nextStepId: Maybe<string> = null;

    if (step.action !== ScrapperAction.Condition) {
      nextStepId = step.nextStep?.id;
    } else {
      nextStepId = (runResult as ConditionalRunScrapperStepResult).result
        ? step.stepOnTrue?.id
        : step.stepOnFalse?.id;
    }

    const nextStep = nextStepId
      ? scrapperRun.steps!.find(
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
