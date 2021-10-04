import { QueryResultModel } from '@scrapper-gate/backend/common';
import { GetScrapperRunsByUserQuery } from '../queries/GetScrapperRunsByUser.query';
import { ScrapperRunRepository } from '../repositories/ScrapperRun.repository';

export interface GetScrapperRunsByUserHandlerDependencies {
  scrapperRunRepository: ScrapperRunRepository;
}

export const getScrapperRunsByUserHandler =
  ({ scrapperRunRepository }: GetScrapperRunsByUserHandlerDependencies) =>
  async ({ payload }: GetScrapperRunsByUserQuery) => {
    const result = await scrapperRunRepository.getByUser(payload);

    return QueryResultModel.fromEntitiesWithTotal(result);
  };
