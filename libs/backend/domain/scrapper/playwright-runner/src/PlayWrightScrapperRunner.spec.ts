import { logger } from '@scrapper-gate/frontend/logger';
import { wait } from '@scrapper-gate/shared/common';
import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper';
import {
  BrowserType,
  RunState,
  ScrapperAction,
  ScrapperRun,
} from '@scrapper-gate/shared/schema';
import playwright, { Browser, LaunchOptions } from 'playwright';
import { v4 } from 'uuid';
import { PlayWrightScrapperRunner } from './PlayWrightScrapperRunner';

describe('PlayWright scrapper runner', () => {
  let runner: PlayWrightScrapperRunner;
  let browser: Browser;

  const ignoredBrowserTypes =
    process.env.IGNORED_BROWSER_TYPES?.split(',') ?? [];
  const browserTypes = Object.values(BrowserType).filter(
    (type) => !ignoredBrowserTypes.includes(type)
  );

  const bootstrapRunner = async (browserType: BrowserType) => {
    const options: LaunchOptions = {};

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

    runner = new PlayWrightScrapperRunner({
      logger,
      traceId: '#trace_id',
      browser,
      browserType,
    });

    await runner.initialize();
  };

  const cleanup = async () => {
    if (runner) {
      await runner.dispose();
    }

    if (browser) {
      await browser.close();
    }
  };

  describe.each(browserTypes)(
    'Popup test site - %s',
    (type) => {
      beforeEach(async () => {
        await bootstrapRunner(type);
      });

      afterEach(async () => {
        await cleanup();
      });

      it('should read text from popup and text that shows after closing it', async () => {
        const scrapperRun: ScrapperRun = {
          id: v4(),
          steps: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          state: RunState.InProgress,
        };

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

        const { performance } = await runner.Click({
          scrapperRun,
          step: clickStep,
          variables: {},
        });

        expect(performance.duration).toBeGreaterThan(0);

        const { values } = await runner.ReadText({
          scrapperRun,
          variables: {},
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
          variables: {},
          scrapperRun,
          step: {
            ...(await createMockScrapperStep({})),
            clickTimes: 1,
            useUrlFromPreviousStep: true,
            action: ScrapperAction.Click,
            key: 'Click close popup',
            selectors: [
              {
                value: '#close_popup',
              },
            ],
          },
        });

        const { values: secondValues } = await runner.ReadText({
          scrapperRun,
          variables: {},
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
      }, 900000);
    },
    900000
  );
});
