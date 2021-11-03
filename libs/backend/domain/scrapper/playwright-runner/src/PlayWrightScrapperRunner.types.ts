import { FilesService } from '@scrapper-gate/backend/domain/files';
import { ScrapperRunScreenshotValue } from '@scrapper-gate/shared/domain/scrapper';
import { Logger } from '@scrapper-gate/shared/logger';
import {
  BrowserType,
  Maybe,
  ScrapperRun,
  ScrapperRunSettings,
} from '@scrapper-gate/shared/schema';
import { Browser } from 'playwright';

export interface PlayWrightScrapperRunnerDependencies {
  browser: Browser;
  traceId: string;
  logger: Logger;
  browserType: BrowserType;
  filesService: FilesService;
  scrapperRun: ScrapperRun;
  runSettings?: Maybe<ScrapperRunSettings>;
}

export interface RawScrapperRunScreenshotValue
  extends Pick<ScrapperRunScreenshotValue, 'sourceElement'> {
  screenshotBuffer: Buffer;
}
