import { queryHandler } from 'functional-cqrs';
import { GetScrappersByUserQuery } from '../queries/GetScrappersByUser.query';
import { ScrapperRepository } from '@scrapper-gate/backend/domain/scrapper';
import { ScrapperQueryResult } from '@scrapper-gate/shared/schema';

export interface GetScrappersByUserHandlerDependencies {
  scrapperRepository: ScrapperRepository;
}

export const getScrappersByUserHandler = queryHandler.asFunction<
  GetScrappersByUserQuery,
  GetScrappersByUserHandlerDependencies
>(
  GetScrappersByUserQuery.name,
  async ({
    context: { scrapperRepository },
    query: { payload },
  }): Promise<ScrapperQueryResult> => {
    const result = await scrapperRepository.getByUser(payload);

    return {
      items: result[0],
      total: result[1],
    };
  }
);
