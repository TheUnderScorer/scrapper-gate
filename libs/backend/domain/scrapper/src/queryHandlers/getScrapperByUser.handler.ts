import { GetScrapperByUserQuery } from '../queries/GetScrapperByUser.query';
import { ScrapperRepository } from '../repositories/Scrapper.repository';

export interface GetScrapperByUserHandlerDependencies {
  scrapperRepository: ScrapperRepository;
}

export const getScrapperByUserHandler =
  ({ scrapperRepository }: GetScrapperByUserHandlerDependencies) =>
  async ({ payload: { scrapperId, userId } }: GetScrapperByUserQuery) => {
    return scrapperRepository.getOneAggregateByUser(scrapperId, userId);
  };
