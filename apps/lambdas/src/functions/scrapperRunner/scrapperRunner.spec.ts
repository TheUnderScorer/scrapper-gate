/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ScrapperModel,
  ScrapperRepository,
  ScrapperRunModel,
  ScrapperRunRepository,
  ScrapperStepModel,
} from '@scrapper-gate/backend/domain/scrapper';
import { UserRepository } from '@scrapper-gate/backend/domain/user';
import { Message } from '@scrapper-gate/backend/message-queue';
import {
  createMockScrapper,
  createMockScrapperStep,
  ScrapperRunnerMessagePayload,
} from '@scrapper-gate/shared/domain/scrapper';
import {
  MouseButton,
  RunnerTrigger,
  ScrapperAction,
  ScrapperType,
} from '@scrapper-gate/shared/schema';
import '../../../../../typings/global/index';
import { scrapperRunner } from './scrapperRunner';

describe('Scrapper runner', () => {
  it('should run real browser scrapper', async () => {
    const userRepository = await global.connection.getCustomRepository(
      UserRepository
    );
    const scrapperRepository =
      global.connection.getCustomRepository(ScrapperRepository);
    const scrapperRunRepository = global.connection.getCustomRepository(
      ScrapperRunRepository
    );

    const scrapper = ScrapperModel.create(createMockScrapper());

    scrapper.type = ScrapperType.RealBrowser;
    scrapper.runSettings = {
      initialUrl: 'http://localhost:8080/blog/index.html',
    };

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

    const secondStep = ScrapperStepModel.create(
      await createMockScrapperStep({
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
      })
    );

    firstStep.nextStep = secondStep;

    scrapper.steps = [firstStep, secondStep];

    await userRepository.save(scrapper.createdBy);
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
