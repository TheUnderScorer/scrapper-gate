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
  | ReadTextScrapperStepResult
  | ConditionalRunScrapperStepResult
  | ScreenshotRunScrapperStepResult;

export type ReadTextValue = Pick<ScrapperRunValue, 'value' | 'sourceElement'>;

export type ReadTextScrapperStepResult = Pick<
  ScrapperRunStepResult,
  'performance'
> & {
  values?: ReadTextValue[];
};

export const isReadTextScrapperStepResult = (
  value: unknown
): value is ReadTextValue =>
  Boolean(value && typeof value === 'object' && 'value' in value);

export interface ConditionalRunScrapperStepResult
  extends Pick<ReadTextScrapperStepResult, 'performance'> {
  result: boolean;
}

export interface ScrapperRunScreenshotValue
  extends Pick<ScrapperRunValue, 'sourceElement'> {
  screenshotFileId: string;
}

export interface ScreenshotRunScrapperStepResult
  extends Pick<ReadTextScrapperStepResult, 'performance'> {
  values: ScrapperRunScreenshotValue[];
}

export type BaseScrapperStepHandlers = {
  [Key in ScrapperAction]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<RunScrapperStepResult>;
};

export type ScrapperStepHandlers = BaseScrapperStepHandlers & {
  [ScrapperAction.Condition]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<ConditionalRunScrapperStepResult>;

  [ScrapperAction.Screenshot]: (
    params: ScrapperStepHandlerParams
  ) => MaybePromise<ScreenshotRunScrapperStepResult>;
};

export interface ScrapperStepHandlerParams {
  scrapperRun: ScrapperRun;
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
