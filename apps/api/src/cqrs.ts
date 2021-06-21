import {
  asCqrs,
  ResolvedCqrs,
  ResolvedCqrsConfig,
} from '@scrapper-gate/backend/awilix';
import { cqrs as scrapperCqrs } from '@scrapper-gate/backend/domain/scrapper';
import { cqrs as userCqrs } from '@scrapper-gate/backend/domain/user';
import { AwilixContainer } from 'awilix';
import { createCqrs } from 'functional-cqrs';

export type ServerCqrsConfig = ReturnType<typeof registerServerCqrs>;

export type ServerCqrs = ResolvedCqrs<
  ServerCqrsConfig['commandHandlers'],
  ServerCqrsConfig['queryHandlers']
>;

export interface ServerCqrsDependencies {
  cqrs: ResolvedCqrsConfig<
    ServerCqrsConfig['commandHandlers'],
    ServerCqrsConfig['queryHandlers']
  >;
}

export const registerServerCqrs = (container: AwilixContainer) => {
  const config = {
    commandHandlers: {
      ...userCqrs.commandHandlers,
      ...scrapperCqrs.commandHandlers,
    },
    queryHandlers: {
      ...scrapperCqrs.queryHandlers,
    },
  };

  container.register({
    cqrs: asCqrs(config),
  });

  return config;
};

export const serverCqrs = ({ cqrs }: ServerCqrsDependencies) =>
  createCqrs(cqrs);
