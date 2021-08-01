/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, EntityManager, Repository } from 'typeorm';

export type RepositoriesProvider = (
  transaction: EntityManager | Connection
) => Record<string, Repository<any>>;
