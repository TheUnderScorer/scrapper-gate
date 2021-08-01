import {
  ScrapperRunModel,
  ScrapperRunRepository,
} from '@scrapper-gate/backend/domain/scrapper';
import { Maybe } from '@scrapper-gate/shared/schema';
import DataLoader from 'dataloader';

export interface LastScrapperRunDataLoaderDependencies {
  scrapperRunRepository: ScrapperRunRepository;
}

export const createLastScrapperRunDataLoader = ({
  scrapperRunRepository,
}: LastScrapperRunDataLoaderDependencies) =>
  new DataLoader<string, Maybe<ScrapperRunModel>>(
    (ids) => scrapperRunRepository.loadLastForScrappers(ids),
    {
      cache: false,
    }
  );
