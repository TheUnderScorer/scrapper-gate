import { GetMyScrapperRunQuery } from '../queries/GetMyScrapperRun.query';
import { ScrapperRunRepository } from '../repositories/ScrapperRun.repository';

export interface GetMyScrapperRunHandlerDependencies {
  scrapperRunRepository: ScrapperRunRepository;
}

export const getMyScrapperRunHandler =
  ({ scrapperRunRepository }: GetMyScrapperRunHandlerDependencies) =>
  async (query: GetMyScrapperRunQuery) =>
    scrapperRunRepository.getOneForUser(query.payload.id, query.payload.userId);
