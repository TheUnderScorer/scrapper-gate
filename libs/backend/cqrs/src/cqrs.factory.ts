import { createCqrs } from 'functional-cqrs';
import {
  CqrsConfigFactory,
  ResolvedCqrsConfig,
  ResolvedCqrsResult,
} from './types';

type BaseConfig = Pick<
  Required<CqrsConfigFactory>,
  'queryHandlers' | 'commandHandlers'
> &
  CqrsConfigFactory;

export interface CqrsFactoryDependencies<Config extends BaseConfig> {
  cqrs: ResolvedCqrsConfig<Config['commandHandlers'], Config['queryHandlers']>;
}

export type CqrsDefinition<
  Config extends Pick<
    Required<CqrsConfigFactory>,
    'queryHandlers' | 'commandHandlers'
  > &
    CqrsConfigFactory
> = {
  resolvedCqrsResult: ResolvedCqrsResult<
    Config['commandHandlers'],
    Config['queryHandlers']
  >;
  resolvedCqrsConfig: ResolvedCqrsConfig<
    Config['commandHandlers'],
    Config['queryHandlers']
  >;
};

export const cqrsFactory = <Config extends BaseConfig>({
  cqrs,
}: CqrsFactoryDependencies<Config>) => createCqrs(cqrs);
