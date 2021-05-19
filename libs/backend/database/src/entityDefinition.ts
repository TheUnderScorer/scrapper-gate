import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Entities } from '@scrapper-gate/shared/common';
import { Constructor } from '@scrapper-gate/shared/constructor';
import { Repository } from 'typeorm';
import { RepositoriesProvider } from './types';

export interface EntityDefinition<
  T extends BaseModel<unknown> = BaseModel<unknown>
> {
  // DB Model of given entity.
  model: Constructor<T>;
  // Repository related to this entity.
  repository: Constructor<Repository<T>>;
  entity: Entities;
  // Repository key that is used inside container to access repository for this entity.
  repositoryKey: string;
}

// Extract repositories from transaction basing on given entity definitions
export const makeRepositoriesProviderFromDefinitions = (
  definitions: EntityDefinition<BaseModel<unknown>>[]
): RepositoriesProvider => (transaction) => {
  return definitions.reduce((acc, def) => {
    return {
      ...acc,
      [def.repositoryKey]: transaction.getCustomRepository(def.repository),
    };
  }, {} as ReturnType<RepositoriesProvider>);
};
