import { queryHandler } from 'functional-cqrs';
import { GetScrapperByUserQuery } from '../queries/GetScrapperByUser.query';
import { ScrapperRepository } from '@scrapper-gate/backend/domain/scrapper';

export interface GetScrapperByUserHandlerDependencies {
  scrapperRepository: ScrapperRepository;
}

export const getScrapperByUserHandler = queryHandler.asFunction<
  GetScrapperByUserQuery,
  GetScrapperByUserHandlerDependencies
>(
  GetScrapperByUserQuery.name,
  ({
    context: { scrapperRepository },
    query: {
      payload: { scrapperId, userId },
    },
  }) => {
    return scrapperRepository.getOneByUser(scrapperId, userId);
  }
);
