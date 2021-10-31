import { asCqrs } from '@scrapper-gate/backend/awilix';
import {
  CqrsDefinition,
  cqrsFactory,
  mergeEventHandlers,
} from '@scrapper-gate/backend/cqrs';
import { cqrs as filesCqrs } from '@scrapper-gate/backend/domain/files';
import { cqrs as scrapperCqrs } from '@scrapper-gate/backend/domain/scrapper';
import { asFunction, AwilixContainer } from 'awilix';

export const registerScrapperRunnerCqrs = (container: AwilixContainer) => {
  const config = {
    commandHandlers: {
      ...scrapperCqrs.commandHandlers,
    },
    eventHandlers: mergeEventHandlers(
      filesCqrs.eventHandlers,
      scrapperCqrs.eventHandlers
    ),
    queryHandlers: {},
  };

  container.register({
    cqrs: asCqrs(config),
    cqrsFactory: asFunction(cqrsFactory),
  });

  return config;
};

export type ScrapperRunnerCqrsConfig = ReturnType<
  typeof registerScrapperRunnerCqrs
>;

type ScrapperRunnerCqrsDefinition = CqrsDefinition<ScrapperRunnerCqrsConfig>;

export type ScrapperRunnerCqrs =
  ScrapperRunnerCqrsDefinition['resolvedCqrsResult'];
