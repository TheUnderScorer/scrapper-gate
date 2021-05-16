import { Disposable, MaybePromise } from '@scrapper-gate/shared/common';
import {
  ScrapperAction,
  ScrapperRun,
  ScrapperRunStepResult,
  ScrapperStep,
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

export interface ScrapperRunner extends ScrapperStepHandlers, Disposable {
  initialize?: () => Promise<void>;
}

export type RunScrapperStepResult = Pick<
  ScrapperRunStepResult,
  'values' | 'performance'
>;

export interface ConditionalRunScrapperStepResult
  extends Pick<RunScrapperStepResult, 'performance'> {
  result: boolean;
}

export type ScrapperStepHandlers = {
  [Key in ScrapperAction]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<RunScrapperStepResult>;
} & {
  [ScrapperAction.Condition]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<ConditionalRunScrapperStepResult>;
};

export interface ScrapperStepHandlerParams {
  scrapperRun: ScrapperRun;
  step: ScrapperStep;
  variables: unknown;
}
