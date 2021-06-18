/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityManager, Repository } from 'typeorm';

export type RepositoriesProvider = (
  transaction: EntityManager
) => Record<string, Repository<any>>;
