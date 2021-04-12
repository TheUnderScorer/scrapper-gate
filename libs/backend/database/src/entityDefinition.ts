import { Constructor, Entities } from '@scrapper-gate/shared/common';
import { Repository } from 'typeorm';
import { RepositoriesProvider } from './types';

export interface EntityDefinition<T> {
  model: Constructor<T>;
  repository: Constructor<Repository<T>>;
  entity: Entities;
  repositoryKey: string;
}

// Extract repositories from transaction basing on given entity definitions
export const makeRepositoriesProviderFromDefinitions = (
  definitions: EntityDefinition<unknown>[]
): RepositoriesProvider => (transaction) => {
  return definitions.reduce((acc, def) => {
    return {
      ...acc,
      [def.repositoryKey]: transaction.getCustomRepository(def.repository),
    };
  }, {} as ReturnType<RepositoriesProvider>);
};
