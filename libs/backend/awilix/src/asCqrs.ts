/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CommandHandlersFactoryMap,
  CqrsConfigFactory,
  QueryHandlersFactoryMap,
  ResolvedCqrsConfig,
} from '@scrapper-gate/backend/cqrs';
import { Resolver } from 'awilix';

export const asCqrs = <
  CommandHandlers extends CommandHandlersFactoryMap,
  QueryHandlers extends QueryHandlersFactoryMap
>(
  config: CqrsConfigFactory<CommandHandlers, QueryHandlers>
): Resolver<ResolvedCqrsConfig<CommandHandlers, QueryHandlers>> => ({
  resolve: (container) => {
    const {
      commandHandlers,
      eventHandlers = {},
      queryHandlers,
      subscribers,
      ...rest
    } = config;

    const [builtCommandHandlers, builtQueryHandlers] = [
      commandHandlers,
      queryHandlers,
    ].map((handlers) => {
      if (!handlers) {
        return undefined;
      }

      const mappedPairs = Object.entries(handlers).map(([key, handler]) => [
        key,
        container.build(handler as any),
      ]);

      return Object.fromEntries(mappedPairs);
    });

    const builtEventHandlers = Object.fromEntries(
      Object.entries(eventHandlers).map(([event, handlers]) => {
        const builtHandlers = handlers.map((handler) =>
          container.build(handler)
        );

        return [event, builtHandlers];
      })
    );
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
