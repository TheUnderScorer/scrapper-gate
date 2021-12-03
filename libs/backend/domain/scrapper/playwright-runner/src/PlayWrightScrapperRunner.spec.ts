import { createS3Client, setupAwsContainer } from '@scrapper-gate/backend/aws';
import {
  FilesService,
  generateScrapperScreenshotFileKey,
} from '@scrapper-gate/backend/domain/files';
import {
  Duration,
  Environment,
  first,
  isError,
  wait,
} from '@scrapper-gate/shared/common';
import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper/mocks';
import { createMockUser } from '@scrapper-gate/shared/domain/user/mocks';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import { logger } from '@scrapper-gate/shared/logger/console';
import {
  BrowserType,
  ConditionalRuleCondition,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
  FileType,
  HtmlConditionalRuleType,
  MouseButton,
  RunState,
  ScrapperAction,
  ScrapperDialogBehaviour,
  ScrapperRun,
  ScrapperStep,
  ScrapperWaitType,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
} from 'awilix';
import { addSeconds } from 'date-fns';
import { createMockProxy } from 'jest-mock-proxy';
import playwright, { Browser, LaunchOptions } from 'playwright';
import { v4 } from 'uuid';
import { persistTestArtifact } from '../../../../../../tests/utils/artifacts';
import '../../../../../../typings/global';
import { createScrapperStepForConditionalTest } from './__mocks__/scrapperStep';
import { setupConfirmationTest } from './__tests__/setupConfirmationTest';
import { setupPromptTest } from './__tests__/setupPromptTest';
import { PlayWrightScrapperRunner } from './PlayWrightScrapperRunner';

let runners: PlayWrightScrapperRunner[] = [];
let browsers: Browser[] = [];

let container: AwilixContainer;

jest.retryTimes(4).setTimeout(900000);

let scrapperRun: ScrapperRun;

describe('PlayWright scrapper runner', () => {
  const ignoredBrowserTypes =
    process.env.IGNORED_BROWSER_TYPES?.split(',') ?? [];
  const browserTypes = Object.values(BrowserType).filter(
    (type) => !ignoredBrowserTypes.includes(type)
  );

  const bootstrapRunner = async (
    browserType: BrowserType,
    initialize = true
  ) => {
    const options: LaunchOptions = {
      headless: true,
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

    container = createContainer();

    setupAwsContainer(container);

    container.register({
      filesService: asClass(FilesService).singleton(),
      s3: asFunction(createS3Client),
      environment: asValue(Environment.Development),
      logger: asValue(logger),
      eventsBus: asValue(createMockProxy()),
    });

    container.resolve('configureAws');

    const runner = new PlayWrightScrapperRunner({
      logger,
      traceId: '#trace_id',
      browser,
      browserType,
      filesService: container.resolve<FilesService>('filesService'),
      scrapperRun,
    });

    browsers.push(browser);

    if (initialize) {
      await runner.initialize();
    }

    runners.push(runner);

    return runner;
  };

  const cleanup = async () => {
    await wait(1000);

    if (runners.length) {
      await Promise.all(runners.map((runner) => runner.dispose()));
    }

    if (browsers.length) {
      browsers.map((browser) => browser.close());
    }

    runners = [];
    browsers = [];
  };

  beforeEach(() => {
    scrapperRun = {
      index: 0,
      id: v4(),
      steps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      state: RunState.InProgress,
      createdBy: createMockUser(),
    };
  });

  describe.each(browserTypes)('Suite for %s browser type', (type) => {
    afterEach(async () => {
      await cleanup();
    });

    describe('Popup test site ', () => {
      it('should handle clicking multiple links', async () => {
        const runner = await bootstrapRunner(type);

        await runner.Click({
          variables: [],
          step: {
            ...(await createMockScrapperStep({})),
            action: ScrapperAction.Click,
            useUrlFromPreviousStep: false,
            url: 'http://localhost:8080/blog/index.html',
            allSelectors: [
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
      });
    });

    describe('Dynamic elements', () => {
      it('should handle dynamic elements', async () => {
        const runner = await bootstrapRunner(type);

        const { values } = await runner.ReadText({
          variables: [],
          step: {
            ...(await createMockScrapperStep({})),
            action: ScrapperAction.Click,
            useUrlFromPreviousStep: false,
            url: 'http://localhost:8080/dynamic-elements.html',
            allSelectors: [
              {
                value: '#result',
              },
            ],
          },
        });

        expect(values).toHaveLength(1);
        expect(values[0].value).toEqual('Loaded successfully.');
      });
    });

    describe('Run javascript action', () => {
      it('should run javascript code with variables', async () => {
        const runner = await bootstrapRunner(type);

        const { values } = await runner.RunJavascript({
          variables: [
            createVariable({
              key: 'test',
              value: 'test',
              scope: VariableScope.Scrapper,
            }),
          ],
          step: {
            ...(await createMockScrapperStep({})),
            action: ScrapperAction.RunJavascript,
            url: 'http://localhost:8080',
            jsCode: `
            function runStep(context) {
              return {
                values: context.variables.test.value
              }
            }
          `,
          },
        });

        expect(values?.map((v) => v.value)).toEqual(['test']);
      });

      it('should store code errors', async () => {
        const runner = await bootstrapRunner(type);

        try {
          await runner.RunJavascript({
            variables: [
              createVariable({
                key: 'test',
                value: 'test',
                scope: VariableScope.Scrapper,
              }),
            ],
            step: {
              ...(await createMockScrapperStep({})),
              action: ScrapperAction.RunJavascript,
              url: 'http://localhost:8080',
              jsCode: `
            function runStep(context) {
              const elements#. = document.querySelectorAll('a');
            }
          `,
            },
          });
        } catch (error) {
          if (!isError(error)) {
            throw new Error('Invalid error received.');
          }

          expect(error).toBeDefined();
          expect(error.message)
            .toEqual(`page.evaluate: SyntaxError: Missing initializer in const declaration
    at new Function (<anonymous>)
    at eval (eval at evaluate (:3:2389), <anonymous>:11:24)
    at t.default.evaluate (<anonymous>:3:2412)
    at t.default.<anonymous> (<anonymous>:1:44)`);

          return;
        }

        throw new Error('No error thrown :(');
      });

      it('should be able to access DOM elements on page', async () => {
        const runner = await bootstrapRunner(type);

        const { values } = await runner.RunJavascript({
          variables: [
            createVariable({
              key: 'test',
              value: 'test',
              scope: VariableScope.Scrapper,
            }),
          ],
          step: {
            ...(await createMockScrapperStep({})),
            action: ScrapperAction.RunJavascript,
            url: 'http://localhost:8080',
            jsCode: `
            function runStep(context) {
              const elements = document.querySelectorAll('a');

              return {
                values: Array.from(elements).map(el => el.getAttribute('href'))
              }
            }
          `,
          },
        });

        expect(values?.map((v) => v.value)).toEqual([
          'article.html',
          'popup.html',
          'dynamic-elements.html',
          'blog/index.html',
          'alert/index.html',
        ]);
      });
    });

    describe('Screenshot action', () => {
      it('should make screenshot of a whole page and save it into s3', async () => {
        const runner = await bootstrapRunner(type);
        const filesService = container.resolve<FilesService>('filesService');

        const step: ScrapperStep = {
          ...(await createMockScrapperStep({})),
          action: ScrapperAction.Screenshot,
          useUrlFromPreviousStep: false,
          url: 'http://localhost:8080/blog/article1.html',
        };

        const result = await runner.Screenshot({
          variables: [],
          step,
        });

        expect(result.values).toHaveLength(1);

        const file = (await filesService.get(
          generateScrapperScreenshotFileKey(scrapperRun.id, step.id),
          FileType.ScrapperScreenshot
        )) as Buffer;

        expect(file).toBeDefined();

        await persistTestArtifact('full-page-screenshot.png', file);
      });

      it('should make screenshot of selected elements and save it into s3', async () => {
        const runner = await bootstrapRunner(type);
        const filesService = container.resolve<FilesService>('filesService');

        const step: ScrapperStep = {
          ...(await createMockScrapperStep({})),
          action: ScrapperAction.Screenshot,
          useUrlFromPreviousStep: false,
          url: 'http://localhost:8080/blog/article1.html',
          allSelectors: [
            {
              value: 'h1',
            },
            {
              value: 'p',
            },
          ],
        };

        const result = await runner.Screenshot({
          variables: [],
          step,
        });

        expect(result.values).toHaveLength(2);

        const files = await Promise.all([
          filesService.get(
            generateScrapperScreenshotFileKey(scrapperRun.id, step.id),
            FileType.ScrapperScreenshot
          ),
          filesService.get(
            generateScrapperScreenshotFileKey(scrapperRun.id, step.id, 2),
            FileType.ScrapperScreenshot
          ),
        ]);

        expect(files.every((file) => file instanceof Buffer)).toEqual(true);

        await Promise.all(
          (files as Buffer[]).map(async (file, index) => {
            await persistTestArtifact(`element-screenshot-${index}.png`, file);
          })
        );
      });
    });

    describe('Read text action', () => {
      it('should read text from popup and text that shows after closing it', async () => {
        const runner = await bootstrapRunner(type);

        const clickStep = await createMockScrapperStep({});
        clickStep.url = 'http://localhost:8080/popup.html';
        clickStep.action = ScrapperAction.Click;
        clickStep.allSelectors = [
          {
            value: '#popup_trigger',
          },
        ];
        clickStep.clickTimes = 1;
        clickStep.key = 'Trigger popup';
        clickStep.useUrlFromPreviousStep = false;
        clickStep.mouseButton = MouseButton.Left;

        const { performance } = await runner.Click({
          step: clickStep,
          variables: [],
        });

        expect(performance?.duration?.ms).toBeGreaterThan(0);

        const { values } = await runner.ReadText({
          variables: [],
          step: {
            ...(await createMockScrapperStep({})),
            useUrlFromPreviousStep: true,
            action: ScrapperAction.ReadText,
            key: 'Read close popup',
            allSelectors: [
              {
                value: '#close_popup',
              },
            ],
          },
        });

        expect(values).toHaveLength(1);
        expect(values[0].value).toEqual('Close popup.');

        expect(runner.currentContext.pages()).toHaveLength(2);
        expect(runner.currentPage.url()).toEqual(
          'http://localhost:8080/popup.html?popup=1'
        );

        await runner.Click({
          variables: [],
          step: {
            ...(await createMockScrapperStep({})),
            clickTimes: 1,
            useUrlFromPreviousStep: true,
            action: ScrapperAction.Click,
            key: 'Click close popup',
            mouseButton: MouseButton.Left,
            allSelectors: [
              {
                value: '#close_popup',
              },
            ],
          },
        });

        const { values: secondValues } = await runner.ReadText({
          variables: [],
          step: {
            ...(await createMockScrapperStep({})),
            useUrlFromPreviousStep: true,
            action: ScrapperAction.ReadText,
            key: 'Read popup closed',
            allSelectors: [
              {
                value: '#popup_closed',
              },
            ],
          },
        });

        expect(secondValues).toHaveLength(1);
        expect(secondValues[0].value).toEqual('Popup was closed.');
      });
    });

    describe('Conditonal rules action', () => {
      it('should pass conditional rule for html element - true result case', async () => {
        const runner = await bootstrapRunner(type);
        const step = await createScrapperStepForConditionalTest([
          {
            value: 'h1',
          },
        ]);

        const { result } = await runner.Condition({
          step,
          variables: [],
        });

        expect(result).toEqual(true);
      });

      it('should pass conditional rule for html element - false result case', async () => {
        const runner = await bootstrapRunner(type);
        const step = await createScrapperStepForConditionalTest([
          {
            value: '#test',
          },
        ]);

        const { result } = await runner.Condition({
          step,
          variables: [],
        });

        expect(result).toEqual(false);
      });
    });

    describe('Prompts and alerts', () => {
      it('should support writing text into prompt', async () => {
        const { promptText, values } = await setupPromptTest({
          createRunner: () => bootstrapRunner(type),
          scrapperRun,
        });

        expect(values).toHaveLength(1);
        expect(first(values)?.value).toEqual(promptText);
      });

      it('should not write prompt text it alert behaviour is to reject', async () => {
        const { values } = await setupPromptTest({
          createRunner: () => bootstrapRunner(type),
          scrapperRun,
          dialogBehaviour: ScrapperDialogBehaviour.AlwaysReject,
        });

        expect(values).toHaveLength(1);
        expect(first(values)?.value).toEqual('');
      });

      it('should accept confirmation dialog', async () => {
        scrapperRun.runSettings = {
          dialogBehaviour: ScrapperDialogBehaviour.AlwaysConfirm,
        };

        const values = await setupConfirmationTest(await bootstrapRunner(type));

        expect(values).toHaveLength(1);
        expect(first(values)?.value).toEqual('Confirmed');
      });

      it('should reject confirmation dialog', async () => {
        scrapperRun.runSettings = {
          dialogBehaviour: ScrapperDialogBehaviour.AlwaysReject,
        };

        const values = await setupConfirmationTest(await bootstrapRunner(type));

        expect(values).toHaveLength(1);
        expect(first(values)?.value).toEqual('Not confirmed');
      });
    });

    describe('Wait action', () => {
      it('should wait for condition - date', async () => {
        const runner = await bootstrapRunner(type);

        const promise = runner.Wait({
          step: {
            ...(await createMockScrapperStep({})),
            waitType: ScrapperWaitType.Condition,
            url: 'http://localhost:8080',
            action: ScrapperAction.Wait,
            waitIntervalTimeout: Duration.fromSeconds(8),
            conditionalRules: [
              {
                matchType: ConditionalRuleGroupMatchType.All,
                rules: [
                  {
                    ruleType: ConditionalRuleType.Date,
                    condition: ConditionalRuleCondition.MoreThanOrEqual,
                    expectedDate: addSeconds(new Date(), 5),
                  },
                ],
              },
            ],
          },
          variables: [],
        });

        await expect(promise).resolves.not.toThrow();
      });

      it('should wait for condition - html element', async () => {
        const runner = await bootstrapRunner(type);

        const promise = runner.Wait({
          step: {
            ...(await createMockScrapperStep({})),
            waitType: ScrapperWaitType.Condition,
            url: 'http://localhost:8080',
            action: ScrapperAction.Wait,
            waitIntervalTimeout: Duration.fromSeconds(8),
            allSelectors: [
              {
                value: 'a',
              },
            ],
            conditionalRules: [
              {
                matchType: ConditionalRuleGroupMatchType.All,
                rules: [
                  {
                    type: HtmlConditionalRuleType.Element,
                    ruleType: ConditionalRuleType.HtmlElement,
                    condition: ConditionalRuleCondition.Exists,
                    selectors: [
                      {
                        value: 'a',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          variables: [],
        });

        await expect(promise).resolves.not.toThrow();
      });

      it('should handle waiting for given time', async () => {
        const runner = await bootstrapRunner(type);

        const waitDuration = Duration.fromSeconds(2);
        const { performance } = await runner.Wait({
          step: {
            ...(await createMockScrapperStep({})),
            url: 'http://localhost:8080',
            waitDuration,
            waitType: ScrapperWaitType.Time,
          },
          variables: [],
        });

        expect(performance?.duration?.ms).toBeGreaterThanOrEqual(
          waitDuration.ms
        );
      });
    });

    describe('Type action', () => {
      it('should clear input before typing if required', async () => {
        const url = 'http://localhost:8080/input/index.html';

        const runner = await bootstrapRunner(type);

        const allSelectors = [
          {
            value: 'input',
          },
        ];

        await runner.Type({
          variables: [],
          step: {
            ...(await createMockScrapperStep({})),
            url,
            action: ScrapperAction.Type,
            typeValue: 'Test',
            allSelectors,
          },
        });

        await runner.Type({
          variables: [],
          step: {
            ...(await createMockScrapperStep({})),
            url,
            action: ScrapperAction.Type,
            typeValue: 'Another value',
            clearInputBeforeTyping: true,
            allSelectors,
          },
        });

        const { values } = await runner.ReadText({
          variables: [],
          step: {
            ...(await createMockScrapperStep({})),
            useUrlFromPreviousStep: true,
            action: ScrapperAction.ReadText,
            allSelectors: [
              {
                value: '#input-value-text',
              },
            ],
            valueType: VariableType.Text,
          },
        });

        expect(first(values).value).toEqual('Another value');
      });
    });

    describe('Read element attribute action', () => {
      it('should read element attributes', async () => {
        const runner = await bootstrapRunner(type);

        const { values } = await runner.ReadAttribute({
          variables: [],
          step: {
            ...(await createMockScrapperStep({})),
            action: ScrapperAction.ReadAttribute,
            useUrlFromPreviousStep: false,
            url: 'http://localhost:8080',
            attributeToRead: 'href',
            allSelectors: [
              {
                value: 'a',
              },
            ],
          },
        });

        expect(values).toHaveLength(5);
        expect(values).toMatchInlineSnapshot(`
        Array [
          Object {
            "sourceElement": Object {
              "classNames": Array [
                "",
              ],
              "id": "",
              "tag": "a",
            },
            "value": "article.html",
          },
          Object {
            "sourceElement": Object {
              "classNames": Array [
                "",
              ],
              "id": "",
              "tag": "a",
            },
            "value": "popup.html",
          },
          Object {
            "sourceElement": Object {
              "classNames": Array [
                "",
              ],
              "id": "",
              "tag": "a",
            },
            "value": "dynamic-elements.html",
          },
          Object {
            "sourceElement": Object {
              "classNames": Array [
                "",
              ],
              "id": "",
              "tag": "a",
            },
            "value": "blog/index.html",
          },
          Object {
            "sourceElement": Object {
              "classNames": Array [
                "",
              ],
              "id": "",
              "tag": "a",
            },
            "value": "alert/index.html",
          },
        ]
      `);
      });
    });
  });
});
