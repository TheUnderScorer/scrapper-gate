/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PropsWithChildren } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { BaseNodeProperties, BaseNodeSelectionProperties, FlowBuilderProps } from '../FlowBuilder.types';

export interface FlowBuilderPropsContext<
  T extends BaseNodeProperties = BaseNodeProperties,
  S extends BaseNodeSelectionProperties = BaseNodeSelectionProperties
> extends Omit<
    FlowBuilderProps<T, S>,
    'initialItems' | 'nodesSelection' | 'graph'
  > {
  activeTab?: string;
}

const Context = createContext<FlowBuilderPropsContext<any, any>>({} as never);

export const useFlowBuilderContextSelector = <Value extends unknown>(
  selector: (ctx: FlowBuilderPropsContext) => Value
) => useContextSelector(Context, selector);

export const FlowBuilderPropsProvider = <
  T extends BaseNodeProperties = BaseNodeProperties,
  S extends BaseNodeSelectionProperties = BaseNodeSelectionProperties
>({
  children,
  ...rest
}: PropsWithChildren<FlowBuilderPropsContext<T, S>>) => {
  return <Context.Provider value={rest}>{children}</Context.Provider>;
};
