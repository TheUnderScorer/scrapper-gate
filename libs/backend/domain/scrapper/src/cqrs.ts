import { CreateScrapper } from './commands/CreateScrapper.command';
import { UpdateScrapper } from './commands/UpdateScrapper.command';
import { createScrapperHandler } from './handlers/createScrapper.handler';
import { updateScrapperHandler } from './handlers/updateScrapper.handler';
import { GetScrapperByUser } from './queries/GetScrapperByUser.query';
import { GetScrappersByUser } from './queries/GetScrappersByUser.query';
import { getScrapperByUserHandler } from './queryHandlers/getScrapperByUser.handler';
import { getScrappersByUserHandler } from './queryHandlers/getScrappersByUser.handler';

export const cqrs = {
  commandHandlers: {
    [CreateScrapper]: createScrapperHandler,
    [UpdateScrapper]: updateScrapperHandler,
  },
  queryHandlers: {
    [GetScrapperByUser]: getScrapperByUserHandler,
    [GetScrappersByUser]: getScrappersByUserHandler,
  },
};
