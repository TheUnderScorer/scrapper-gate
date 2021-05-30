import { queryHandler } from 'functional-cqrs';
import { GetScrapperByUserQuery } from '../queries/GetScrapperByUser.query';
import { ScrapperRepository } from '../repositories/Scrapper.repository';

export interface GetScrapperByUserHandlerDependencies {
  scrapperRepository: ScrapperRepository;
}

export const getScrapperByUserHandler = queryHandler.asFunction<
  GetScrapperByUserQuery,
  GetScrapperByUserHandlerDependencies
>(
  GetScrapperByUserQuery.name,
  async ({
    context: { scrapperRepository },
    query: {
      payload: { scrapperId, userId },
    },
  }) => {
    return scrapperRepository.getOneByUser(scrapperId, userId);
  }
);
