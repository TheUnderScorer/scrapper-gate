import { FilesService } from '@scrapper-gate/backend/domain/files';
import { PlayWrightScrapperRunner } from '@scrapper-gate/backend/domain/scrapper/playwright-runner';
import { Logger } from '@scrapper-gate/shared/logger';
import { BrowserType, ScrapperType } from '@scrapper-gate/shared/schema';
import type { Browser } from 'playwright';
import { ScrapperModel } from '../models/Scrapper.model';

export interface GetScrapperRunnerDependencies {
  browser: Browser;
  traceId: string;
  logger: Logger;
  browserType: BrowserType;
  filesService: FilesService;
}

export const makeGetScrapperRunner =
  (dependencies: GetScrapperRunnerDependencies) =>
  (scrapper: ScrapperModel) => {
    switch (scrapper.type) {
      case ScrapperType.RealBrowser:
        return new PlayWrightScrapperRunner(dependencies);

      default:
        throw new TypeError(`Unsupported scrapper type: ${scrapper.type}`);
    }
  };

export type GetScrapperRunner = ReturnType<typeof makeGetScrapperRunner>;
