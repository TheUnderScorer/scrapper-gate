import { Disposable, MaybePromise } from '@scrapper-gate/shared/common';
import {
  RunnerTrigger,
  ScrapperAction,
  ScrapperRun,
  ScrapperRunStepResult,
  ScrapperRunValue,
  ScrapperStep,
  Variable,
} from '@scrapper-gate/shared/schema';

export interface RunScrapperParams {
  scrapperRun: ScrapperRun;
  variables: unknown;
}

// TODO Return performance metrics?
export interface RunScrapperResult {
  scrapperRun: ScrapperRun;
  durationMs: number;
}

export interface InitialiseScrapperRunnerParams {
  initialUrl?: string;
}

export interface ScrapperRunner extends ScrapperStepHandlers, Disposable {
  initialize?: (params?: InitialiseScrapperRunnerParams) => Promise<void>;
}

export type RunScrapperStepResult = Pick<
  ScrapperRunStepResult,
  'performance'
> & {
  values?: Pick<ScrapperRunValue, 'value' | 'sourceElement'>[];
};

export interface ConditionalRunScrapperStepResult
  extends Pick<RunScrapperStepResult, 'performance'> {
  result: boolean;
}

type BaseStepHandlers = {
  [Key in ScrapperAction]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<RunScrapperStepResult>;
};

export type ScrapperStepHandlers = BaseStepHandlers & {
  [ScrapperAction.Condition]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<ConditionalRunScrapperStepResult>;
};

export interface ScrapperStepHandlerParams {
  scrapperRun: ScrapperRun;
  step: ScrapperStep;
  variables: Variable[];
}

export interface ScrapperRunnerMessagePayload {
  runId: string;
  trigger: RunnerTrigger;
}

export type ScrapperRunResultKeyPairValues = Record<string, string[]>;
