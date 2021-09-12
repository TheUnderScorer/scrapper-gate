import { EventHandlerFn } from 'functional-cqrs/build/types/event';
import { HandlerFactory } from './types';

export function mergeEventHandlers(
  ...handlersArray: Record<string, HandlerFactory<EventHandlerFn>[]>[]
) {
  return handlersArray.reduce<Record<string, HandlerFactory<EventHandlerFn>[]>>(
    (acc, handlers) => {
      const entries = Object.entries(handlers);

      entries.forEach(([event, handlers]) => {
        if (!acc[event]) {
          acc[event] = [];
        }

        acc[event].push(...handlers);
      });

      return acc;
    },
    {}
  );
}
