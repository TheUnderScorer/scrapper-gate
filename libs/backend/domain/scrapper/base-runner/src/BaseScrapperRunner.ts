import { PerformanceManager } from '@scrapper-gate/backend/perf-hooks-utils';
import { wait } from '@scrapper-gate/shared/common';
import {
  CommonScrapperStepResult,
  ScrapperRunner,
  ScrapperStepHandlerParams,
} from '@scrapper-gate/shared/domain/scrapper';
import {
  Maybe,
  ScrapperAction,
  ScrapperRun,
  ScrapperRunSettings,
  ScrapperStep,
  ScrapperWaitType,
} from '@scrapper-gate/shared/schema';

export class BaseScrapperRunner
  implements
    Pick<
      ScrapperRunner,
      ScrapperAction.ChangeRunSettings | ScrapperAction.Wait
    >
{
  protected runSettings?: Maybe<ScrapperRunSettings>;

  protected readonly performanceManager = new PerformanceManager();

  protected readonly traceId: string;

  protected readonly scrapperRun: ScrapperRun;

  protected constructor(
    scrapperRun: ScrapperRun,
    traceId: string,
    runSettings?: Maybe<ScrapperRunSettings>
  ) {
    this.scrapperRun = scrapperRun;
    this.runSettings = runSettings ?? scrapperRun.runSettings;
    this.traceId = traceId;
  }

  protected startPerformanceMark(step: ScrapperStep) {
    this.performanceManager.mark(`${this.traceId}-${step.id}-start`);
  }

  protected getPerformanceMark(step: ScrapperStep) {
    this.performanceManager.mark(`${this.traceId}-${step.id}-end`);
    this.performanceManager.measure(
      `${this.traceId}-${step.id}`,
      `${this.traceId}-${step.id}-start`,
      `${this.traceId}-${step.id}-end`
    );

    return this.performanceManager.getEntry(`${this.traceId}-${step.id}`);
  }

  async ChangeRunSettings({
    step,
  }: ScrapperStepHandlerParams): Promise<CommonScrapperStepResult> {
    await this.startPerformanceMark(step);

    if (step.newRunSettings) {
      this.runSettings = {
        ...this.runSettings,
        ...step.newRunSettings,
      };
    }

    return this.getCommonStepResult(step);
  }

  async Wait({
    step,
  }: ScrapperStepHandlerParams): Promise<CommonScrapperStepResult> {
    await this.startPerformanceMark(step);

    if (step.waitType === ScrapperWaitType.Time) {
      await wait(step.waitDuration?.ms ?? 0);

      return this.getCommonStepResult(step);
    }

    throw new Error(`${step.waitType} is not supported in this runner.`);
  }

  protected async getCommonStepResult(
    step: ScrapperStep
  ): Promise<CommonScrapperStepResult> {
    const entry = await this.getPerformanceMark(step);

    return {
      performance: entry,
    };
  }
}
