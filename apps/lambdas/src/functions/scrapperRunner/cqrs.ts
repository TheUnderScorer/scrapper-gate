import { asCqrs } from '@scrapper-gate/backend/awilix';
import { cqrs as scrapperCqrs } from '@scrapper-gate/backend/domain/scrapper';
import { AwilixContainer } from 'awilix';
import { CqrsDefinition } from '../../../../../libs/backend/cqrs/src/cqrs.factory';

export const registerScrapperRunnerCqrs = (container: AwilixContainer) => {
  const config = {
    commandHandlers: {
      ...scrapperCqrs.commandHandlers,
    },
    queryHandlers: {},
  };

  container.register({ cqrs: asCqrs(config) });

  return config;
};

export type ScrapperRunnerCqrsConfig = ReturnType<
  typeof registerScrapperRunnerCqrs
>;

type ScrapperRunnerCqrsDefinition = CqrsDefinition<ScrapperRunnerCqrsConfig>;

export type ScrapperRunnerCqrs = ScrapperRunnerCqrsDefinition['resolvedCqrsResult'];
