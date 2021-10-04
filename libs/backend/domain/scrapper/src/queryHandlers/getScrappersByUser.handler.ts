import { QueryResultModel } from '@scrapper-gate/backend/common';
import { GetScrappersByUserQuery } from '../queries/GetScrappersByUser.query';
import { ScrapperRepository } from '../repositories/Scrapper.repository';

export interface GetScrappersByUserHandlerDependencies {
  scrapperRepository: ScrapperRepository;
}

export const getScrappersByUserHandler =
  ({ scrapperRepository }: GetScrappersByUserHandlerDependencies) =>
  async ({ payload }: GetScrappersByUserQuery) => {
    const result = await scrapperRepository.getByUser(payload);

    return QueryResultModel.fromEntitiesWithTotal(result);
  };
