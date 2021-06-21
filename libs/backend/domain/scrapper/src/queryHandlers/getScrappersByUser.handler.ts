import { ScrapperQueryResult } from '@scrapper-gate/shared/schema';
import { GetScrappersByUserQuery } from '../queries/GetScrappersByUser.query';
import { ScrapperRepository } from '../repositories/Scrapper.repository';

export interface GetScrappersByUserHandlerDependencies {
  scrapperRepository: ScrapperRepository;
}

export const getScrappersByUserHandler = ({
  scrapperRepository,
}: GetScrappersByUserHandlerDependencies) => async ({
  payload,
}: GetScrappersByUserQuery): Promise<ScrapperQueryResult> => {
  const result = await scrapperRepository.getByUser(payload);

  return {
    items: result[0],
    total: result[1],
  };
};
