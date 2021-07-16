import { Maybe } from '@scrapper-gate/shared/schema';
import type DataLoader from 'dataloader';
import { ScrapperRunModel } from '../models/ScrapperRun.model';
import { GetScrapperLastRunQuery } from '../queries/GetScrapperLastRun.query';

export interface GetScrapperLastRunHandlerDependencies {
  lastScrapperRunDataLoader: DataLoader<string, Maybe<ScrapperRunModel>>;
}

export const getScrapperLastRunHandler =
  ({ lastScrapperRunDataLoader }: GetScrapperLastRunHandlerDependencies) =>
  async ({ payload: { scrapperId } }: GetScrapperLastRunQuery) => {
    return lastScrapperRunDataLoader.load(scrapperId);
  };
