import React, { FC } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { FlowBuilderProps } from '../FlowBuilder';

export interface FlowBuilderPropsContext
  extends Omit<FlowBuilderProps, 'initialItems' | 'nodesSelection' | 'graph'> {
  activeTab?: string;
}

const Context = createContext<FlowBuilderPropsContext>({} as never);

export const useFlowBuilderContextSelector = <Value extends unknown>(
  selector: (ctx: FlowBuilderPropsContext) => Value
) => useContextSelector(Context, selector);

export const FlowBuilderPropsProvider: FC<FlowBuilderPropsContext> = ({
  children,
  ...rest
}) => {
  return <Context.Provider value={rest}>{children}</Context.Provider>;
};
