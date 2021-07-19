import { MessageQueueService } from '@scrapper-gate/backend/domain/message-queue-service';
import { ScrapperRepository } from '../repositories/Scrapper.repository';
import { ScrapperAlreadyRunningError } from '@scrapper-gate/shared/errors';
import {
  BrowserType,
  RunnerTrigger,
  RunState,
} from '@scrapper-gate/shared/schema';
import { SendScrapperToRunnerQueueCommand } from '../commands/SendScrapperToRunnerQueue.command';

export interface SendScrapperToRunnerQueueHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  messageQueueService: MessageQueueService;
  traceId: string;
}

export const sendScrapperToRunnerQueueHandler =
  ({
    scrapperRepository,
    messageQueueService,
    traceId,
  }: SendScrapperToRunnerQueueHandlerDependencies) =>
  async ({ payload: { input, userId } }: SendScrapperToRunnerQueueCommand) => {
    const scrapper = await scrapperRepository.getOneByUser(
      input.scrapperId,
      userId
    );

    if (scrapper.isRunning) {
      throw new ScrapperAlreadyRunningError();
    }

    await messageQueueService.sendToScrapperQueue(
      {
        traceId,
        date: new Date().toISOString(),
        payload: {
          scrapperId: input.scrapperId,
          trigger: RunnerTrigger.Manual,
        },
      },
      input.browserType ?? BrowserType.Chrome
    );

    scrapper.state = RunState.Pending;

    await scrapperRepository.save(scrapper);

    return scrapper;
  };
