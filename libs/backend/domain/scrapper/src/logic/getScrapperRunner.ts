import { FilesService } from '@scrapper-gate/backend/domain/files';
import { PlayWrightScrapperRunner } from '@scrapper-gate/backend/domain/scrapper/playwright-runner';
import { Logger } from '@scrapper-gate/shared/logger';
import {
  BrowserType,
  ScrapperRunSettings,
  ScrapperType,
} from '@scrapper-gate/shared/schema';
import type { Browser } from 'playwright';
import { ScrapperRunModel } from '../models/ScrapperRun.model';

export interface GetScrapperRunnerDependencies {
  browser: Browser;
  traceId: string;
  logger: Logger;
  browserType: BrowserType;
  filesService: FilesService;
}

export const makeGetScrapperRunner =
  (dependencies: GetScrapperRunnerDependencies) =>
  (scrapperRun: ScrapperRunModel, runSettings?: ScrapperRunSettings) => {
    if (!scrapperRun.scrapper) {
      throw new TypeError('Scrapper is missing in scrapper run.');
    }

    switch (scrapperRun.scrapper.type) {
      case ScrapperType.RealBrowser:
        return new PlayWrightScrapperRunner({
          ...dependencies,
          scrapperRun,
          runSettings,
        });

      default:
        throw new TypeError(
          `Unsupported scrapper type: ${scrapperRun.scrapper.type}`
        );
    }
  };

export type GetScrapperRunner = ReturnType<typeof makeGetScrapperRunner>;
