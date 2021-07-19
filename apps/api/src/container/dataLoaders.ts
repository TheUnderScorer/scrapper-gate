import { createLastScrapperRunDataLoader } from '@scrapper-gate/backend/domain/scrapper/data-loaders';
import { asFunction, AwilixContainer } from 'awilix';

export const setupDataLoaders = (container: AwilixContainer) => {
  container.register({
    lastScrapperRunDataLoader: asFunction(createLastScrapperRunDataLoader)
      .scoped()
      .disposer((loader) => loader.clearAll()),
  });
};
