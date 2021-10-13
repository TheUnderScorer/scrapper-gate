import { ScrapperRunRepository } from '../repositories/ScrapperRun.repository';
import { GetScrapperLastRunQuery } from '../queries/GetScrapperLastRun.query';

export interface GetScrapperLastRunHandlerDependencies {
  scrapperRunRepository: ScrapperRunRepository;
}

export const getScrapperLastRunHandler =
  ({ scrapperRunRepository }: GetScrapperLastRunHandlerDependencies) =>
  async ({ payload: { scrapperId } }: GetScrapperLastRunQuery) => {
    return scrapperRunRepository.findLastForScrapper(scrapperId);
  };
