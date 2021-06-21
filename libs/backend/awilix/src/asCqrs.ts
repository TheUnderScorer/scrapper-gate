import { Resolver } from 'awilix';
import {
  CommandHandlersFactoryMap,
  CqrsConfigFactory,
  QueryHandlersFactoryMap,
  ResolvedCqrsConfig,
} from './asCqrs.types';

export const asCqrs = <
  CommandHandlers extends CommandHandlersFactoryMap,
  QueryHandlers extends QueryHandlersFactoryMap
>(
  config: CqrsConfigFactory<CommandHandlers, QueryHandlers>
): Resolver<ResolvedCqrsConfig<CommandHandlers, QueryHandlers>> => ({
  resolve: (container) => {
    const {
      commandHandlers,
      eventHandlers,
      queryHandlers,
      subscribers,
      ...rest
    } = config;

    const [builtCommandHandlers, builtEventHandlers, builtQueryHandlers] = [
      commandHandlers,
      eventHandlers,
      queryHandlers,
    ].map((handlers) => {
      if (!handlers) {
        return undefined;
      }

      const mappedPairs = Object.entries(handlers).map(([key, handler]) => [
        key,
        container.build(handler),
      ]);

      return Object.fromEntries(mappedPairs);
    });

    const builtSubscribers = subscribers?.map((sub) => container.build(sub));

    return {
      commandHandlers: builtCommandHandlers,
      eventHandlers: builtEventHandlers,
      queryHandlers: builtQueryHandlers,
      subscribers: builtSubscribers,
      ...rest,
    };
  },
});
