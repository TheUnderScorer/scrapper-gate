import { Constructor } from '@scrapper-gate/shared/constructor';
import {
  CommandHandler,
  CommandHandlerFn,
  CommandsBus,
  CqrsConfig,
  CqrsResult,
  EventsBus,
  EventSubscriber,
  HandlersMap,
  QueriesBus,
  QueryHandler,
  QueryHandlerFn,
} from 'functional-cqrs';
import { EventHandlerFn } from 'functional-cqrs/build/types/event';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerFactory<T> = (...args: any[]) => T;

export type CommandHandlersFactoryMap = HandlersMap<
  HandlerFactory<CommandHandlerFn | CommandHandler>
>;

export type ResolvedCommandHandlersFactoryMap<
  T extends CommandHandlersFactoryMap
> = {
  [Key in keyof T]: ReturnType<T[Key]>;
};

export type QueryHandlersFactoryMap = HandlersMap<
  HandlerFactory<QueryHandlerFn | QueryHandler>
>;

export type ResolvedQueryHandlersFactoryMap<
  T extends QueryHandlersFactoryMap
> = {
  [Key in keyof T]: ReturnType<T[Key]>;
};

export declare type EventHandlersFactoryMap = HandlersMap<
  HandlerFactory<EventHandlerFn>[]
>;

export type CqrsConfigFactory<
  CommandHandlers extends CommandHandlersFactoryMap = CommandHandlersFactoryMap,
  QueryHandlers extends QueryHandlersFactoryMap = QueryHandlersFactoryMap
> = {
  commandHandlers?: CommandHandlers;
  queryHandlers?: QueryHandlers;
  eventHandlers?: EventHandlersFactoryMap;
  subscribers?: Constructor<EventSubscriber>[];
  CommandsBusConstructor?: Constructor<CommandsBus>;
  QueriesBusConstructor?: Constructor<QueriesBus>;
  EventsBusConstructor?: Constructor<EventsBus>;
};

export type ResolvedCqrsConfig<
  CommandHandlers extends CommandHandlersFactoryMap = CommandHandlersFactoryMap,
  QueryHandlers extends QueryHandlersFactoryMap = QueryHandlersFactoryMap
> = CqrsConfig<
  ResolvedCommandHandlersFactoryMap<CommandHandlers>,
  ResolvedQueryHandlersFactoryMap<QueryHandlers>
>;

export type ResolvedCqrs<
  CommandHandlers extends CommandHandlersFactoryMap = CommandHandlersFactoryMap,
  QueryHandlers extends QueryHandlersFactoryMap = QueryHandlersFactoryMap
> = CqrsResult<
  ResolvedCommandHandlersFactoryMap<CommandHandlers>,
  ResolvedQueryHandlersFactoryMap<QueryHandlers>
>;
