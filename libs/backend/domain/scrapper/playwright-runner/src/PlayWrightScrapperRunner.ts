import { PerformanceManager } from '@scrapper-gate/backend/perf-hooks-utils';
import {
  areUrlsEqual,
  last,
  mapSelectorsToXpathExpression,
} from '@scrapper-gate/shared/common';
import {
  resolveScrapperStepRules,
  ScrapperStepHandlerParams,
  ScrapperStepHandlers,
} from '@scrapper-gate/shared/domain/scrapper';
import { ScrapperRunError } from '@scrapper-gate/shared/errors';
import { Logger } from '@scrapper-gate/shared/logger';
import {
  RunnerPerformanceEntry,
  ScrapperRunValue,
  Selector,
  SelectorType,
} from '@scrapper-gate/shared/schema';
import { Browser, BrowserContext, Page } from 'playwright';
import { elementHandlesToHtmlElementRuleDefinition } from './elementHandlesToHtmlElementRuleDefinition';
import { handleToSourceElement } from './handleToSourceElement';
import { mouseButtonMap } from './mouseButtonMap';

export interface PlayWrightScrapperRunnerDependencies {
  browser: Browser;
  traceId: string;
  logger: Logger;
}

interface AfterRunResult {
  performance: RunnerPerformanceEntry;
}

// TODO Extract common logic + performance logic
export class PlayWrightScrapperRunner implements ScrapperStepHandlers {
  private context: BrowserContext;
  private page: Page;
  private initialPage: Page;

  private readonly browser: Browser;
  private readonly logger: Logger;
  private readonly traceId: string;
  private readonly performanceManager = new PerformanceManager();

  constructor({
    browser,
    traceId,
    logger,
  }: PlayWrightScrapperRunnerDependencies) {
    this.browser = browser;
    this.traceId = traceId;
    this.logger = logger;
  }

  async initialize() {
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

    this.setupPage();
  }

  // TODO Support all kind of dialogs
  // Performs setup of given page, registering necessary event listeners
  private setupPage() {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    this.page.on('popup', (page) => {
      this.page = page;

      this.setupPage();
    });

    this.page.once('close', () => {
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
      const { elements } = await this.preRun(params);
      const { step } = params;

      await Promise.all(
        elements.map((element) =>
          element.click({
            clickCount: step.clickTimes ?? 1,
            button: step.mouseButton
              ? mouseButtonMap[step.mouseButton]
              : 'left',
          })
        )
      );

      const { performance } = await this.afterRun(params);

      return {
        values: [],
        performance,
      };
    } catch (e) {
      throw await this.onError(e, params);
    }
  }

  async Condition(params: ScrapperStepHandlerParams) {
    try {
      const { elements } = await this.preRun(params);

      const { result } = await resolveScrapperStepRules(params.step, {
        htmlResolver: {
          elements: await elementHandlesToHtmlElementRuleDefinition(elements),
        },
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

      const values: ScrapperRunValue[] = await Promise.all(
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
          el.type(step.typeValue, {
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

    if (querySelector.length) {
      waitPromises.push(this.page.waitForSelector(querySelector));
    }

    if (xpathSelector.length) {
      waitPromises.push(this.page.waitForSelector(xpathSelector));
    }

    await Promise.all(waitPromises);
    const elementsByQuerySelector = querySelector
      ? await target.$$(querySelector)
      : [];
    const elementsByXpath = xpathSelector ? await target.$$(xpathSelector) : [];

    return [...elementsByQuerySelector, ...elementsByXpath];
  }

  private async preRun({ step }: ScrapperStepHandlerParams) {
    if (!this.page) {
      throw new Error('Page was closed or was not initialized properly.');
    }

    this.performanceManager.mark(`${this.traceId}-${step.id}-start`);

    const currentUrl = await this.page.url();

    if (!step.useUrlFromPreviousStep && !areUrlsEqual(step.url, currentUrl)) {
      await this.page.goto(step.url, {
        waitUntil: 'networkidle',
      });
    }

    const elements = await this.getElements(step.selectors ?? []);

    return { elements };
  }

  private async onError(error: Error, params: ScrapperStepHandlerParams) {
    const { performance } = await this.afterRun(params);

    return new ScrapperRunError({
      performance,
      message: error.message,
    });
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
      `${this.traceId}-${step.id}-end`
    );

    return {
      performance: {
        duration: entry?.duration ?? 0,
      },
    };
  }
}
