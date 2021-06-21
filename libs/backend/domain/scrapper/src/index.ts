import { CreateScrapper } from './commands/CreateScrapper.command';
import { UpdateScrapper } from './commands/UpdateScrapper.command';
import { createScrapperHandler } from './handlers/createScrapper.handler';
import { updateScrapperHandler } from './handlers/updateScrapper.handler';
import { GetScrapperByUser } from './queries/GetScrapperByUser.query';
import { GetScrappersByUser } from './queries/GetScrappersByUser.query';
import { getScrapperByUserHandler } from './queryHandlers/getScrapperByUser.handler';
import { getScrappersByUserHandler } from './queryHandlers/getScrappersByUser.handler';

export * from './models/Scrapper.model';
export * from './models/ScrapperStep.model';
export * from './repositories/Scrapper.repository';
export * from './repositories/ScrapperStep.repository';
export * from './scrapper.entity';
export * from './scrapperStep.entity';
export * from './queries/GetScrappersByUser.query';
export * from './queryHandlers/getScrappersByUser.handler';
export * from './commands/CreateScrapper.command';
export * from './handlers/createScrapper.handler';
export * from './queries/GetScrapperByUser.query';
export * from './queryHandlers/getScrapperByUser.handler';
export * from './commands/UpdateScrapper.command';
export * from './handlers/updateScrapper.handler';
export * from './scrapperRun.entity';
export * from './scrapperRunStepResult.entity';
export * from './scrapperRunStepValue.entity';

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
