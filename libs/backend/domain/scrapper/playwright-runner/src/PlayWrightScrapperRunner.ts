import { FilesService } from '@scrapper-gate/backend/domain/files';
import { PerformanceManager } from '@scrapper-gate/backend/perf-hooks-utils';
import {
  areUrlsEqual,
  last,
  mapSelectorsToXpathExpression,
} from '@scrapper-gate/shared/common';
import {
  InitialiseScrapperRunnerParams,
  resolveScrapperStepRules,
  ScrapperRunner,
  ScrapperRunScreenshotValue,
  ScrapperStepHandlerParams,
  ScreenshotRunScrapperStepResult,
} from '@scrapper-gate/shared/domain/scrapper';
import { ScrapperRunError } from '@scrapper-gate/shared/errors';
import { Logger } from '@scrapper-gate/shared/logger';
import {
  BrowserType,
  FileType,
  RunnerPerformanceEntry,
  ScrapperRunValue,
  ScrapperStep,
  Selector,
  SelectorType,
} from '@scrapper-gate/shared/schema';
import { Browser, BrowserContext, ElementHandle, Page } from 'playwright';
import { elementHandlesToHtmlElementRuleDefinition } from './elementHandlesToHtmlElementRuleDefinition';
import { handleToSourceElement } from './handleToSourceElement';
import { mouseButtonMap } from './mouseButtonMap';

export interface PlayWrightScrapperRunnerDependencies {
  browser: Browser;
  traceId: string;
  logger: Logger;
  browserType: BrowserType;
  filesService: FilesService;
}

interface AfterRunResult {
  performance: RunnerPerformanceEntry;
}

interface RawScrapperRunScreenshotValue
  extends Pick<ScrapperRunScreenshotValue, 'sourceElement'> {
  screenshotBuffer: Buffer;
}

// TODO Extract common logic + performance logic
export class PlayWrightScrapperRunner implements ScrapperRunner {
  private context: BrowserContext;
  private page: Page;
  private initialPage: Page;

  private readonly browserType: BrowserType;
  private readonly browser: Browser;
  private readonly logger: Logger;
  private readonly traceId: string;
  private readonly performanceManager = new PerformanceManager();
  private readonly filesService: FilesService;

  constructor({
    browser,
    traceId,
    logger,
    browserType,
    filesService,
  }: PlayWrightScrapperRunnerDependencies) {
    this.browser = browser;
    this.traceId = traceId;
    this.logger = logger;
    this.browserType = browserType;
    this.filesService = filesService;
  }

  async initialize({ initialUrl }: InitialiseScrapperRunnerParams = {}) {
    if (this.context) {
      this.logger.error('Runner already initialized.');

      return;
    }

    this.context = await this.browser.newContext({
      // TODO Support downloads with size limit?
      acceptDownloads: false,
    });
    this.page = await this.context.newPage();
    this.initialPage = this.page;

    if (initialUrl) {
      await this.page.goto(initialUrl, {
        waitUntil: 'networkidle',
      });
    }

    await this.setupPage();

    this.logger.debug('PlayWrightRunner initialized:', {
      browserVersion: this.browserVersion,
    });
  }

  // Performs setup of given page, registering necessary event listeners
  private async setupPage() {
    await this.page.waitForLoadState('networkidle');

    // TODO Support all kind of dialogs
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    this.page.on('popup', async (page) => {
      this.logger.info('Popup opened', {
        url: page.url(),
        pages: this.context.pages().length,
      });

      this.page = page;

      await this.setupPage();
    });

    this.page.once('close', () => {
      this.logger.debug('Page closed', this.context.pages().length);

      this.page = last(this.context.pages());
    });
  }

  async dispose() {
    await Promise.all([
      this.context.close(),
      this.performanceManager.dispose(),
    ]);
  }

  // TODO Support modifiers
  // TODO Handle popup windows https://playwright.dev/docs/1.0.0/verification#page-events
  async Click(params: ScrapperStepHandlerParams) {
    try {
      const { querySelector, xpathSelector } = await this.preRun(params);
      const { step } = params;

      const options = {
        clickCount: step.clickTimes ?? 1,
        button: step.mouseButton ? mouseButtonMap[step.mouseButton] : 'left',
      };

      if (querySelector) {
        await this.page.click(querySelector, options);
      }

      if (xpathSelector) {
        await this.page.click(xpathSelector, options);
      }

      const { performance } = await this.afterRun(params);

      return {
        values: [],
        performance,
      };
    } catch (e) {
      throw await this.onError(e, params);
    }
  }

  async Screenshot(
    params: ScrapperStepHandlerParams
  ): Promise<ScreenshotRunScrapperStepResult> {
    try {
      const { elements } = await this.preRun(params);

      const rawScreenshots = await this.getScreenshots(elements, params.step);

      const screenshots: ScrapperRunScreenshotValue[] = await Promise.all(
        rawScreenshots.map(async (screenshot, index) => {
          const key = `scrapper-run-${params.scrapperRun.id}/step-${
            params.step.id
          }/screenshot-${index + 1}.png`;

          return {
            sourceElement: screenshot.sourceElement,
            screenshotFileId: await this.filesService.upload(
              screenshot.screenshotBuffer,
              key,
              FileType.ScrapperScreenshot
            ),
          };
        })
      );

      const { performance } = await this.afterRun(params);

      return {
        performance,
        values: screenshots,
      };
    } catch (e) {
      throw await this.onError(e, params);
    }
  }

  private async getScreenshots(
    elements: ElementHandle<SVGElement | HTMLElement>[],
    step: ScrapperStep
  ): Promise<RawScrapperRunScreenshotValue[]> {
    const screenshots: RawScrapperRunScreenshotValue[] = [];

    if (!elements.length) {
      screenshots.push({
        screenshotBuffer: await this.page.screenshot({
          type: 'png',
          fullPage: Boolean(step.fullPageScreenshot),
        }),
      });
    } else {
      await Promise.all(
        elements.map(async (element) =>
          screenshots.push({
            screenshotBuffer: await element.screenshot({
              type: 'png',
            }),
            sourceElement: await handleToSourceElement(element),
          })
        )
      );
    }

    return screenshots;
  }

  async Condition(params: ScrapperStepHandlerParams) {
    try {
      const { elements } = await this.preRun(params);

      const { result } = await resolveScrapperStepRules(params.step, {
        htmlResolver: {
          elements: await elementHandlesToHtmlElementRuleDefinition(elements),
        },
        variables: params.scrapperRun.variables ?? [],
      });

      const { performance } = await this.afterRun(params);

      return {
        result,
        performance,
      };
    } catch (e) {
      throw await this.onError(e, params);
    }
  }

  async GoBack(params: ScrapperStepHandlerParams) {
    try {
      await this.preRun(params);

      await this.page.goBack({
        waitUntil: 'networkidle',
      });

      return this.afterRun(params);
    } catch (e) {
      throw await this.onError(e, params);
    }
  }

  async NavigateTo(params: ScrapperStepHandlerParams) {
    try {
      await this.preRun(params);

      return this.afterRun(params);
    } catch (e) {
      throw await this.onError(e, params);
    }
  }

  async ReadText(params: ScrapperStepHandlerParams) {
    try {
      const { elements } = await this.preRun(params);

      const values: Pick<ScrapperRunValue, 'value' | 'sourceElement'>[] =
        await Promise.all(
          elements.map(async (el) => ({
            value: await el.textContent(),
            sourceElement: await handleToSourceElement(el),
          }))
        );

      const { performance } = await this.afterRun(params);

      return {
        values,
        performance,
      };
    } catch (e) {
      throw await this.onError(e, params);
    }
  }

  async ReloadPage(params: ScrapperStepHandlerParams) {
    try {
      await this.preRun(params);

      await this.page.reload({
        waitUntil: 'networkidle',
      });

      return this.afterRun(params);
    } catch (e) {
      throw await this.onError(e, params);
    }
  }

  async Type(params: ScrapperStepHandlerParams) {
    try {
      const { elements } = await this.preRun(params);

      const { step } = params;

      await Promise.all(
        elements.map((el) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          el.type(step.typeValue!, {
            delay: step.typeDelay,
          })
        )
      );

      return this.afterRun(params);
    } catch (e) {
      throw await this.onError(e, params);
    }
  }

  private async getElements(selectors: Selector[]) {
    const target = this.page;

    const querySelector = selectors
      .filter(
        (selector) => !selector.type || selector.type === SelectorType.Selector
      )
      .map(({ value }) => value)
      .join(',');

    const xpathSelector = mapSelectorsToXpathExpression(
      selectors.filter((selector) => selector.type === SelectorType.TextContent)
    );

    const waitPromises = [];

    if (querySelector) {
      waitPromises.push(
        this.page.waitForSelector(querySelector, {
          state: 'visible',
          timeout: 40000,
        })
      );
    }

    if (xpathSelector) {
      waitPromises.push(this.page.waitForSelector(xpathSelector));
    }

    // TODO Option to either fail or continue if no elements were found
    try {
      await Promise.all(waitPromises);
    } catch (e) {
      this.logger.error(e);
    }

    const elementsByQuerySelector = querySelector
      ? await target.$$(querySelector)
      : [];
    const elementsByXpath = xpathSelector ? await target.$$(xpathSelector) : [];

    const elements = [...elementsByQuerySelector, ...elementsByXpath];

    return {
      elements,
      querySelector,
      xpathSelector,
    };
  }

  private async preRun({ step }: ScrapperStepHandlerParams) {
    if (!this.page) {
      throw new Error('Page was closed or was not initialized properly.');
    }

    this.logger.debug('Pre run:', step);

    this.performanceManager.mark(`${this.traceId}-${step.id}-start`);

    const currentUrl = this.page.url();

    const urlsEqual = areUrlsEqual(step.url, currentUrl);

    this.logger.debug('Urls:', {
      currentUrl,
      stepUrl: step.url,
      urlsEqual,
    });

    if (!step.useUrlFromPreviousStep && !urlsEqual) {
      await this.page.goto(step.url, {
        waitUntil: 'networkidle',
      });

      this.logger.debug('Navigated to step url:', this.page.url());
    } else {
      await this.page.waitForLoadState('networkidle');

      this.logger.debug('Not navigating to other page.', this.page.url());
    }

    return this.getElements(step.selectors ?? []);
  }

  // TODO Screenshot on error?
  private async onError(error: Error, params: ScrapperStepHandlerParams) {
    const { performance } = await this.afterRun(params);

    return new ScrapperRunError({
      performance,
      message: error.message,
      url: this.page.url(),
      browserVersion: this.browserVersion,
    });
  }

  get currentPage() {
    return this.page;
  }

  get currentContext() {
    return this.context;
  }

  get browserVersion() {
    return `${this.browserType} ${this.browser.version()}`;
  }

  private async afterRun({
    step,
  }: ScrapperStepHandlerParams): Promise<AfterRunResult> {
    this.performanceManager.mark(`${this.traceId}-${step.id}-end`);
    this.performanceManager.measure(
      `${this.traceId}-${step.id}`,
      `${this.traceId}-${step.id}-start`,
      `${this.traceId}-${step.id}-end`
    );

    const entry = await this.performanceManager.getEntry(
      `${this.traceId}-${step.id}`
    );

    return {
      performance: {
        duration: entry?.duration ?? 0,
      },
    };
  }
}
