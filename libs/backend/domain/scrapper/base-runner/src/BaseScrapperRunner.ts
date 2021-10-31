import { MaybePromise } from '@scrapper-gate/shared/common';
import {
  RunScrapperStepResult,
  ScrapperRunner,
  ScrapperStepHandlerParams,
} from '@scrapper-gate/shared/domain/scrapper';
import {
  Maybe,
  ScrapperAction,
  ScrapperRun,
  ScrapperRunSettings,
} from '@scrapper-gate/shared/schema';

export class BaseScrapperRunner
  implements Pick<ScrapperRunner, ScrapperAction.ChangeRunSettings>
{
  protected runSettings?: Maybe<ScrapperRunSettings>;

  protected constructor(
    scrapperRun: ScrapperRun,
    runSettings?: Maybe<ScrapperRunSettings>
  ) {
    this.runSettings = runSettings ?? scrapperRun.runSettings;
  }

  ChangeRunSettings({
    step,
  }: ScrapperStepHandlerParams): MaybePromise<RunScrapperStepResult> {
    if (step.newRunSettings) {
      this.runSettings = {
        ...this.runSettings,
        ...step.newRunSettings,
      };
    }

    return {
      values: [],
    };
  }
}
