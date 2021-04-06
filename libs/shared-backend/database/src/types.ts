import { EntityManager, Repository } from 'typeorm';

export type RepositoriesProvider = (
  transaction: EntityManager
) => Record<string, Repository<unknown>>;
