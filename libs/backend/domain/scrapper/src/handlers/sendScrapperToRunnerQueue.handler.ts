import { MessageQueueService } from '@scrapper-gate/backend/domain/message-queue-service';
import { getNextIndex } from '@scrapper-gate/shared/common';
import { ScrapperAlreadyRunningError } from '@scrapper-gate/shared/errors';
import {
  BrowserType,
  RunnerTrigger,
  SendScrapperToQueueResult,
} from '@scrapper-gate/shared/schema';
import { SendScrapperToRunnerQueueCommand } from '../commands/SendScrapperToRunnerQueue.command';
import { ScrapperRunModel } from '../models/ScrapperRun.model';
import { ScrapperRepository } from '../repositories/Scrapper.repository';
import { ScrapperRunRepository } from '../repositories/ScrapperRun.repository';

export interface SendScrapperToRunnerQueueHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  scrapperRunRepository: ScrapperRunRepository;
  messageQueueService: MessageQueueService;
  traceId: string;
}

export const sendScrapperToRunnerQueueHandler =
  ({
    scrapperRepository,
    messageQueueService,
    traceId,
    scrapperRunRepository,
  }: SendScrapperToRunnerQueueHandlerDependencies) =>
  async ({
    payload: { input, userId },
  }: SendScrapperToRunnerQueueCommand): Promise<SendScrapperToQueueResult> => {
    const scrapper = await scrapperRepository.getOneAggregateByUser(
      input.scrapperId,
      userId
    );

    const lastRun = await scrapperRunRepository.findLastForScrapper(
      scrapper.id
    );

    if (lastRun?.isRunning) {
      throw new ScrapperAlreadyRunningError();
    }

    const run = ScrapperRunModel.createPendingFromScrapper(
      scrapper,
      getNextIndex(lastRun)
    );

    await scrapperRunRepository.save(run);

    await messageQueueService.sendToScrapperQueue(
      {
        traceId,
        date: new Date().toISOString(),
        payload: {
          runId: run.id,
          trigger: RunnerTrigger.Manual,
        },
      },
      input.browserType ?? BrowserType.Chrome
    );

    await scrapperRepository.save(scrapper);

    return {
      run,
      scrapper,
    };
  };
