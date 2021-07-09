import { wait } from '@scrapper-gate/shared/common';
import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper';
import { logger } from '@scrapper-gate/shared/logger/console';
import {
  BrowserType,
  MouseButton,
  RunState,
  ScrapperAction,
  ScrapperRun,
} from '@scrapper-gate/shared/schema';
import playwright, { Browser, LaunchOptions } from 'playwright';
import { v4 } from 'uuid';
import { PlayWrightScrapperRunner } from './PlayWrightScrapperRunner';

const timeout = 900000;

let runners: PlayWrightScrapperRunner[] = [];
let browsers: Browser[] = [];

describe('PlayWright scrapper runner', () => {
  const ignoredBrowserTypes =
    process.env.IGNORED_BROWSER_TYPES?.split(',') ?? [];
  const browserTypes = Object.values(BrowserType).filter(
    (type) => !ignoredBrowserTypes.includes(type)
  );

  const bootstrapRunner = async (browserType: BrowserType) => {
    const options: LaunchOptions = {
      headless: false,
    };

    let browser: Browser;

    switch (browserType) {
      case BrowserType.Safari:
        browser = await playwright.webkit.launch();
        break;

      case BrowserType.Firefox:
        browser = await playwright.firefox.launch(options);
        break;

      default:
        browser = await playwright.chromium.launch(options);

        break;
    }

    await wait(1000);

    const runner = new PlayWrightScrapperRunner({
      logger,
      traceId: '#trace_id',
      browser,
      browserType,
    });

    browsers.push(browser);

    await runner.initialize();

    runners.push(runner);

    return runner;
  };

  const cleanup = async () => {
    await wait(1000);

    if (runners.length) {
      await Promise.all(runners.map((runner) => runner.dispose()));
    }

    if (browsers.length) {
      await browsers.map((browser) => browser.close());
    }

    runners = [];
    browsers = [];
  };

  describe.each(browserTypes)(
    'Popup test site - %s',
    (type) => {
      afterEach(async () => {
        await cleanup();
      });

      const scrapperRun: ScrapperRun = {
        id: v4(),
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        state: RunState.InProgress,
      };

      it(
        'should handle clicking multiple links',
        async () => {
          const runner = await bootstrapRunner(type);

          await runner.Click({
            scrapperRun,
            variables: [],
            step: {
              ...(await createMockScrapperStep({})),
              action: ScrapperAction.Click,
              useUrlFromPreviousStep: false,
              url: 'http://localhost:8080/blog/index.html',
              selectors: [
                {
                  value: 'a',
                },
              ],
            },
          });

          await runner.currentPage.waitForLoadState('networkidle');

          expect(runner.currentPage.url()).toEqual(
            'http://localhost:8080/blog/article1.html'
          );
        },
        timeout
      );

      it(
        'should handle dynamic elements',
        async () => {
          const runner = await bootstrapRunner(type);

          const { values } = await runner.ReadText({
            scrapperRun,
            variables: [],
            step: {
              ...(await createMockScrapperStep({})),
              action: ScrapperAction.Click,
              useUrlFromPreviousStep: false,
              url: 'http://localhost:8080/dynamic-elements.html',
              selectors: [
                {
                  value: '#result',
                },
              ],
            },
          });

          expect(values).toHaveLength(1);
          expect(values[0].value).toEqual('Loaded successfully.');
        },
        timeout
      );

      it(
        'should read text from popup and text that shows after closing it',
        async () => {
          const runner = await bootstrapRunner(type);

          const clickStep = await createMockScrapperStep({});
          clickStep.url = 'http://localhost:8080/popup.html';
          clickStep.action = ScrapperAction.Click;
          clickStep.selectors = [
            {
              value: '#popup_trigger',
            },
          ];
          clickStep.clickTimes = 1;
          clickStep.key = 'Trigger popup';
          clickStep.useUrlFromPreviousStep = false;
          clickStep.mouseButton = MouseButton.Left;

          const { performance } = await runner.Click({
            scrapperRun,
            step: clickStep,
            variables: [],
          });

          expect(performance.duration).toBeGreaterThan(0);

          const { values } = await runner.ReadText({
            scrapperRun,
            variables: [],
            step: {
              ...(await createMockScrapperStep({})),
              useUrlFromPreviousStep: true,
              action: ScrapperAction.ReadText,
              key: 'Read close popup',
              selectors: [
                {
                  value: '#close_popup',
                },
              ],
            },
          });

          expect(values).toHaveLength(1);
          expect(values[0].value).toEqual('Close popup.');

          expect(runner.currentContext.pages()).toHaveLength(2);
          expect(await runner.currentPage.url()).toEqual(
            'http://localhost:8080/popup.html?popup=1'
          );

          await runner.Click({
            variables: [],
            scrapperRun,
            step: {
              ...(await createMockScrapperStep({})),
              clickTimes: 1,
              useUrlFromPreviousStep: true,
              action: ScrapperAction.Click,
              key: 'Click close popup',
              mouseButton: MouseButton.Left,
              selectors: [
                {
                  value: '#close_popup',
                },
              ],
            },
          });

          const { values: secondValues } = await runner.ReadText({
            scrapperRun,
            variables: [],
            step: {
              ...(await createMockScrapperStep({})),
              useUrlFromPreviousStep: true,
              action: ScrapperAction.ReadText,
              key: 'Read popup closed',
              selectors: [
                {
                  value: '#popup_closed',
                },
              ],
            },
          });

          expect(secondValues).toHaveLength(1);
          expect(secondValues[0].value).toEqual('Popup was closed.');
        },
        timeout
      );
    },
    timeout
  );
});
