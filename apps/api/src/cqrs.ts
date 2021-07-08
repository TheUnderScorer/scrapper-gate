import { asCqrs } from '@scrapper-gate/backend/awilix';
import { cqrs as scrapperCqrs } from '@scrapper-gate/backend/domain/scrapper';
import { cqrs as userCqrs } from '@scrapper-gate/backend/domain/user';
import { AwilixContainer } from 'awilix';
import { CqrsDefinition } from '../../../libs/backend/cqrs/src/cqrs.factory';

export type ServerCqrsConfig = ReturnType<typeof registerServerCqrs>;

type ServerCqrsDefinition = CqrsDefinition<ServerCqrsConfig>;

export type ServerCqrs = ServerCqrsDefinition['resolvedCqrsResult'];

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
