import { Disposable, MaybePromise } from '@scrapper-gate/shared/common';
import {
  Maybe,
  RunnerTrigger,
  ScrapperAction,
  ScrapperRun,
  ScrapperRunSettings,
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

export interface ScrapperRunner extends ScrapperStepHandlers, Disposable {
  initialize?: () => Promise<void>;
}

export type RunScrapperStepResult =
  | ReadValueScrapperStepResult
  | ConditionalRunScrapperStepResult
  | ScreenshotRunScrapperStepResult;

export type ReadTextValue = Pick<ScrapperRunValue, 'value' | 'sourceElement'>;

export interface ReadValueScrapperStepResult extends CommonScrapperStepResult {
  values?: ReadTextValue[];
}

export type CommonScrapperStepResult = Pick<
  ScrapperRunStepResult,
  'performance'
>;

export interface ConditionalRunScrapperStepResult
  extends CommonScrapperStepResult {
  result: boolean;
}

export interface ScrapperRunScreenshotValue
  extends Pick<ScrapperRunValue, 'sourceElement'> {
  screenshotFileId: string;
}

export interface ScreenshotRunScrapperStepResult
  extends CommonScrapperStepResult {
  values: ScrapperRunScreenshotValue[];
}

export type BaseScrapperStepHandlers = {
  [Key in ScrapperAction]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<CommonScrapperStepResult>;
};

export type ScrapperStepHandlers = BaseScrapperStepHandlers & {
  [ScrapperAction.Condition]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<ConditionalRunScrapperStepResult>;

  [ScrapperAction.ReadText]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<ReadValueScrapperStepResult>;

  [ScrapperAction.ReadAttribute]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<ReadValueScrapperStepResult>;

  [ScrapperAction.Screenshot]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<ScreenshotRunScrapperStepResult>;
};

export interface ScrapperStepHandlerParams {
  step: ScrapperStep;
  variables: Variable[];
}

export interface ScrapperRunnerMessagePayload {
  runId: string;
  trigger: RunnerTrigger;
  runSettings?: Maybe<ScrapperRunSettings>;
}

export type ScrapperRunResultKeyPairValues = Record<string, string[]>;

export interface ScrapperStepFinishedPayload {
  result: RunScrapperStepResult;
  scrapperRun: ScrapperRun;
  stepResult: ScrapperRunStepResult;
}
