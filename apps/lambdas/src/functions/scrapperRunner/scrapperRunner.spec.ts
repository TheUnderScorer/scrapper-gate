/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import { generateScrapperScreenshotFileKey } from '@scrapper-gate/backend/domain/files';
import {
  ScrapperModel,
  ScrapperRepository,
  ScrapperRunModel,
  ScrapperRunRepository,
  ScrapperStepModel,
} from '@scrapper-gate/backend/domain/scrapper';
import { UserRepository } from '@scrapper-gate/backend/domain/user';
import { Message } from '@scrapper-gate/backend/message-queue';
import { ScrapperRunnerMessagePayload } from '@scrapper-gate/shared/domain/scrapper';
import {
  createMockScrapper,
  createMockScrapperStep,
} from '@scrapper-gate/shared/domain/scrapper/mocks';
import {
  FileAccess,
  FileKind,
  FileType,
  MouseButton,
  RunnerTrigger,
  ScrapperAction,
  ScrapperType,
} from '@scrapper-gate/shared/schema';
import '../../../../../typings/global/index';
import { scrapperRunner } from './scrapperRunner';

let userRepository: UserRepository;
let scrapperRepository: ScrapperRepository;
let scrapperRunRepository: ScrapperRunRepository;

async function createScrapper() {
  const scrapper = ScrapperModel.create({
    ...createMockScrapper(),
    steps: [],
  });
  await userRepository.save(scrapper.createdBy);

  scrapper.type = ScrapperType.RealBrowser;
  scrapper.runSettings = {
    initialUrl: 'http://localhost:8080/blog/index.html',
  };

  return scrapper;
}

describe('Scrapper runner', () => {
  beforeEach(() => {
    userRepository = global.connection.getCustomRepository(UserRepository);
    scrapperRepository =
      global.connection.getCustomRepository(ScrapperRepository);
    scrapperRunRepository = global.connection.getCustomRepository(
      ScrapperRunRepository
    );
  });

  it('should persist screenshots with scrapper', async () => {
    const scrapper = await createScrapper();

    const step = ScrapperStepModel.create(
      await createMockScrapperStep({
        createdBy: scrapper.createdBy,
        intercept: (step) => {
          step.useUrlFromPreviousStep = true;
          step.action = ScrapperAction.Screenshot;
          step.isFirst = true;

          delete step.url;

          return step;
        },
      })
    );

    scrapper.steps = [step];

    await scrapperRepository.save(scrapper);

    const run = ScrapperRunModel.createPendingFromScrapper(scrapper, 0);
    await scrapperRunRepository.save(run);

    await scrapperRunner(
      {
        Records: [
          {
            body: JSON.stringify({
              traceId: '#trace',
              date: new Date().toISOString(),
              payload: {
                runId: run.id,
                trigger: RunnerTrigger.Manual,
              },
            } as Message<ScrapperRunnerMessagePayload>),
          },
        ],
      } as any,
      global.connection
    );

    const updatedRun =
      await scrapperRunRepository.findLastForScrapperWithValues(scrapper.id);

    const screenshot = updatedRun!.results![0].values![0].screenshot;

    expect(screenshot).toBeDefined();
    expect(screenshot.kind).toEqual(FileKind.Image);
    expect(screenshot.access).toEqual(FileAccess.Private);
    expect(screenshot.type).toEqual(FileType.ScrapperScreenshot);
    expect(screenshot.key).toEqual(
      generateScrapperScreenshotFileKey(
        updatedRun!.id,
        updatedRun!.results![0].step.id
      )
    );
  });

  it('should run real browser scrapper', async () => {
    const scrapper = await createScrapper();

    const firstStep = ScrapperStepModel.create(
      await createMockScrapperStep({
        createdBy: scrapper.createdBy,
        intercept: (step) => {
          step.useUrlFromPreviousStep = true;
          step.action = ScrapperAction.Click;
          step.mouseButton = MouseButton.Left;
          step.selectors = [
            {
              value: 'a',
            },
          ];

          return step;
        },
      })
    );

    const secondStep = ScrapperStepModel.create({
      ...(await createMockScrapperStep({
        createdBy: scrapper.createdBy,
        intercept: (step) => {
          step.useUrlFromPreviousStep = true;
          step.action = ScrapperAction.ReadText;
          step.selectors = [
            {
              value: '#article_title',
            },
          ];

          return step;
        },
      })),
    });

    firstStep.nextStep = secondStep;

    scrapper.steps = [firstStep, secondStep];

    await scrapperRepository.save(scrapper);

    const run = ScrapperRunModel.createPendingFromScrapper(scrapper, 0);
    await scrapperRunRepository.save(run);

    await scrapperRunner(
      {
        Records: [
          {
            body: JSON.stringify({
              traceId: '#trace',
              date: new Date().toISOString(),
              payload: {
                runId: run.id,
                trigger: RunnerTrigger.Manual,
              },
            } as Message<ScrapperRunnerMessagePayload>),
          },
        ],
      } as any,
      global.connection
    );

    const updatedRun =
      await scrapperRunRepository.findLastForScrapperWithValues(scrapper.id);

    expect(updatedRun).toBeDefined();
    expect(updatedRun?.results).toHaveLength(scrapper.steps.length);

    const result = updatedRun?.results?.find(
      (result) => result.step.action === ScrapperAction.ReadText
    );

    expect(result?.values).toHaveLength(1);
    expect(result?.values?.[0].value).toEqual('Article 1');
  });
});
