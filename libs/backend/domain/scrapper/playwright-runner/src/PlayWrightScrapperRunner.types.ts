import { FilesService } from '@scrapper-gate/backend/domain/files';
import {
  ScrapperRunScreenshotValue,
  ScrapperStepHandlerParams,
} from '@scrapper-gate/shared/domain/scrapper';
import { Logger } from '@scrapper-gate/shared/logger';
import {
  BrowserType,
  Maybe,
  ScrapperRun,
  ScrapperRunSettings,
} from '@scrapper-gate/shared/schema';
import { Browser, ElementHandle } from 'playwright';

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

export type BasePreRunParams = ScrapperStepHandlerParams &
  Pick<ScrapperRunSettings, 'noElementsFoundBehavior'>;

export interface PreRunParams extends BasePreRunParams {
  getElements?: boolean;
}

export interface PreRunParamsWithElements extends BasePreRunParams {
  getElements: true;
}

export interface PreRunParamsWithoutElements extends BasePreRunParams {
  getElements?: false;
}

export interface GetElementsResult {
  elements: ElementHandle<SVGElement | HTMLElement>[];
  querySelector: string;
  xpathSelector: string;
}
