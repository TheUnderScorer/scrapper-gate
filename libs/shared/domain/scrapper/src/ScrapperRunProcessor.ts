/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createBaseEntity,
  Disposable,
  Perhaps,
} from '@scrapper-gate/shared/common';
import {
  createVariable,
  resolveVariables,
} from '@scrapper-gate/shared/domain/variables';
import { ErrorObjectDto } from '@scrapper-gate/shared/errors';
import { Logger } from '@scrapper-gate/shared/logger';
import {
  findFirstNode,
  getNextStepIdFromCondition,
} from '@scrapper-gate/shared/node';
import { canBeSkipped } from '@scrapper-gate/shared/run-states';
import {
  RunState,
  Scrapper,
  ScrapperAction,
  ScrapperRun,
  ScrapperRunStepResult,
  ScrapperRunValue,
  ScrapperStep,
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { Typed } from 'emittery';
import {
  ConditionalRunScrapperStepResult,
  isReadTextScrapperStepResult,
  RunScrapperStepResult,
  ScrapperRunner,
  ScrapperStepFinishedPayload,
} from './types';

export interface ProcessParams {
  scrapperRun: ScrapperRun;
  scrapper: Scrapper;
}

export class ScrapperRunProcessor implements Disposable {
  readonly events = new Typed<{
    scrapperRunChanged: ScrapperRun;
    stepFinished: ScrapperStepFinishedPayload;
    error: {
      error: Error;
      step: ScrapperStep;
    };
    filledStepResultAfterRun: {
      runStepResult: RunScrapperStepResult;
      result: ScrapperRunStepResult;
    };
  }>();

  private completed = false;

  private readonly variables: Variable[] = [];

  constructor(
    private readonly runner: ScrapperRunner,
    private readonly logger: Logger,
    private readonly scrapperRun: ScrapperRun
  ) {
    this.variables = [...(scrapperRun.variables ?? [])];
  }

  async process() {
    if (this.completed) {
      throw new Error(
        'Run was already completed, in order to start a new one create new processor instance.'
      );
    }

    let failed = false;

    const scrapperRun = this.scrapperRun;

    if (!scrapperRun.steps?.length) {
      return {
        scrapperRun,
      };
    }

    await this.runner.initialize?.();

    scrapperRun.state = RunState.InProgress;
    scrapperRun.startedAt = new Date();

    if (!Array.isArray(scrapperRun.results)) {
      scrapperRun.results = [];
    }

    await this.events.emit('scrapperRunChanged', scrapperRun);

    let step = findFirstNode(scrapperRun.steps);

    try {
      while (step) {
        const { nextStep } = await this.runStep(step);

        step = nextStep!;
      }
    } catch (error) {
      this.logger.error(`Step ${step?.id} failed: ${error.message}`);

      const errorObject = ErrorObjectDto.createFromError(error);

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

    this.completed = true;

    scrapperRun.endedAt = new Date();
    scrapperRun.state = failed ? RunState.Failed : RunState.Completed;

    scrapperRun.results.forEach((result) => {
      // Mark all not completed steps as skipped
      if (canBeSkipped(result.state)) {
        result.state = RunState.Skipped;
      }
    });

    await this.events.emit('scrapperRunChanged', scrapperRun);

    this.logger.info(`Run ${scrapperRun.id} finished.`);

    return {
      scrapperRun,
    };
  }

  private async runStep(step: ScrapperStep) {
    const scrapperRun = this.scrapperRun;

    const variables = this.variables;

    const stepResult = scrapperRun.results!.find(
      (result) => result.step.id === step.id
    );

    if (!stepResult) {
      throw new TypeError(`No step result found for step ${step.id}`);
    }

    stepResult.startedAt = new Date();
    stepResult.state = RunState.InProgress;

    await this.events.emit('scrapperRunChanged', scrapperRun);

    const preparedStep = resolveVariables({
      target: step,
      variables,
    });

    // Overwrite step from result with step that has resolved variables
    stepResult.step = preparedStep;

    try {
      const runResult: RunScrapperStepResult = await this.runner[step.action!]({
        scrapperRun,
        step: preparedStep,
        variables,
      });

      await this.fillStepResultAfterRun(runResult, stepResult);
      this.maybeCreateVariableFromResult(runResult, preparedStep);

      stepResult.state = RunState.Completed;

      await this.events.emit('stepFinished', {
        result: runResult,
        scrapperRun,
        stepResult,
      });
      await this.events.emit('scrapperRunChanged', scrapperRun);

      let nextStepId: Perhaps<string> = null;

      if (step.action !== ScrapperAction.Condition) {
        nextStepId = step.nextStep?.id;
      } else {
        nextStepId = getNextStepIdFromCondition(
          preparedStep,
          (runResult as ConditionalRunScrapperStepResult).result
        );
      }

      const nextStep = nextStepId
        ? scrapperRun.steps!.find(
            (scrapperRunStep) => scrapperRunStep.id === nextStepId
          )
        : null;

      return {
        nextStep,
      };
    } catch (error) {
      const errorObject = ErrorObjectDto.createFromError(error);

      // Persist error on step level
      stepResult.state = RunState.Failed;
      stepResult.error = errorObject;

      await this.events.emit('scrapperRunChanged', scrapperRun);

      // Throw error again in order to store it on run level as well
      throw error;
    }
  }

  private maybeCreateVariableFromResult(
    result: RunScrapperStepResult,
    step: ScrapperStep
  ) {
    if ('values' in result) {
      this.variables.push(
        createVariable({
          value: result.values?.map(
            (value) => isReadTextScrapperStepResult(value) && value.value
          ),
          type: step.valueType ?? VariableType.Text,
          scope: VariableScope.Scrapper,
          key: step.key,
        })
      );
    }
  }

  private async fillStepResultAfterRun(
    runStepResult: RunScrapperStepResult,
    result: ScrapperRunStepResult
  ) {
    if ('values' in runStepResult) {
      result.values = runStepResult?.values?.map(
        ({ sourceElement, ...rest }) => {
          const runValue: ScrapperRunValue = {
            ...createBaseEntity(),
            sourceElement,
          };

          if ('value' in rest) {
            runValue.value = rest.value;
          }

          return runValue;
        }
      );
    }

    result.performance = runStepResult.performance;
    result.state = RunState.Completed;
    result.endedAt = new Date();

    await this.events.emit('filledStepResultAfterRun', {
      result,
      runStepResult,
    });
  }

  async dispose() {
    await this.runner.dispose();

    this.events.clearListeners();
  }
}
