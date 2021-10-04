import { CreateScrapper } from './commands/CreateScrapper.command';
import { RunScrapper } from './commands/RunScrapper.command';
import { SendScrapperToRunnerQueue } from './commands/SendScrapperToRunnerQueue.command';
import { UpdateScrapper } from './commands/UpdateScrapper.command';
import { createScrapperHandler } from './handlers/createScrapper.handler';
import { RunScrapperHandler } from './handlers/RunScrapper.handler';
import { sendScrapperToRunnerQueueHandler } from './handlers/sendScrapperToRunnerQueue.handler';
import { updateScrapperHandler } from './handlers/updateScrapper.handler';
import { GetMyScrapperRun } from './queries/GetMyScrapperRun.query';
import { GetScrapperByUser } from './queries/GetScrapperByUser.query';
import { GetScrapperLastRun } from './queries/GetScrapperLastRun.query';
import { GetScrapperRunsByUser } from './queries/GetScrapperRunsByUser.query';
import { GetScrappersByUser } from './queries/GetScrappersByUser.query';
import { getMyScrapperRunHandler } from './queryHandlers/getMyScrapperRun.handler';
import { getScrapperByUserHandler } from './queryHandlers/getScrapperByUser.handler';
import { getScrapperLastRunHandler } from './queryHandlers/getScrapperLastRun.handler';
import { getScrapperRunsByUserHandler } from './queryHandlers/getScrapperRunsByUser.handler';
import { getScrappersByUserHandler } from './queryHandlers/getScrappersByUser.handler';

export const cqrs = {
  commandHandlers: {
    [CreateScrapper]: createScrapperHandler,
    [UpdateScrapper]: updateScrapperHandler,
    [SendScrapperToRunnerQueue]: sendScrapperToRunnerQueueHandler,
    [RunScrapper]: RunScrapperHandler,
  },
  queryHandlers: {
    [GetScrapperByUser]: getScrapperByUserHandler,
    [GetScrappersByUser]: getScrappersByUserHandler,
    [GetScrapperLastRun]: getScrapperLastRunHandler,
    [GetMyScrapperRun]: getMyScrapperRunHandler,
    [GetScrapperRunsByUser]: getScrapperRunsByUserHandler,
  },
};
