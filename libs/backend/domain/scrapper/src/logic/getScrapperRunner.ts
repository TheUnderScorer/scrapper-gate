import { ScrapperModel } from '@scrapper-gate/backend/domain/scrapper';
import { PlayWrightScrapperRunner } from '@scrapper-gate/backend/domain/scrapper/playwright-runner';
import { Logger } from '@scrapper-gate/shared/logger';
import { BrowserType, ScrapperType } from '@scrapper-gate/shared/schema';
import type { Browser } from 'playwright';

export interface GetScrapperRunnerDependencies {
  browser: Browser;
  traceId: string;
  logger: Logger;
  browserType: BrowserType;
}

export const makeGetScrapperRunner = (
  dependencies: GetScrapperRunnerDependencies
) => (scrapper: ScrapperModel) => {
  switch (scrapper.type) {
    case ScrapperType.RealBrowser:
      return new PlayWrightScrapperRunner(dependencies);

    default:
      throw new TypeError(`Unsupported scrapper type: ${scrapper.type}`);
  }
};

export type GetScrapperRunner = ReturnType<typeof makeGetScrapperRunner>;
