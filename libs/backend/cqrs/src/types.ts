// eslint-disable-next-line @typescript-eslint/no-explicit-any
import {
  Constructor,
  ResolvedConstructor,
} from '@scrapper-gate/shared/constructor';
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
  HandlerFactory<CommandHandlerFn> | Constructor<CommandHandler>
>;

type ResolvedCommandHandler<
  T extends HandlerFactory<unknown> | Constructor<CommandHandler>
> = T extends HandlerFactory<infer S>
  ? S
  : T extends Constructor<unknown>
  ? ResolvedConstructor<T>
  : never;

type ResolvedQueryHandler<
  T extends HandlerFactory<unknown> | Constructor<QueryHandler>
> = T extends HandlerFactory<infer S>
  ? S
  : T extends Constructor<unknown>
  ? ResolvedConstructor<T>
  : never;

export type ResolvedCommandHandlersFactoryMap<
  T extends CommandHandlersFactoryMap
> = {
  [Key in keyof T]: ResolvedCommandHandler<T[Key]>;
};

export type QueryHandlersFactoryMap = HandlersMap<
  HandlerFactory<QueryHandlerFn> | Constructor<QueryHandler>
>;

export type ResolvedQueryHandlersFactoryMap<T extends QueryHandlersFactoryMap> =
  {
    [Key in keyof T]: ResolvedQueryHandler<T[Key]>;
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

export type ResolvedCqrsResult<
  CommandHandlers extends CommandHandlersFactoryMap = CommandHandlersFactoryMap,
  QueryHandlers extends QueryHandlersFactoryMap = QueryHandlersFactoryMap
> = CqrsResult<
  ResolvedCommandHandlersFactoryMap<CommandHandlers>,
  ResolvedQueryHandlersFactoryMap<QueryHandlers>
>;
