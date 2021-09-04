import { Selection } from '@scrapper-gate/frontend/common';
import React, { createContext, ReactNode, useContext } from 'react';
import { BaseNodeSelectionProperties } from '../FlowBuilder.types';

export interface FlowBuilderSelectionContext<
  S extends BaseNodeSelectionProperties
> {
  selection?: Selection<S>[];
}

const Context = createContext<
  FlowBuilderSelectionContext<BaseNodeSelectionProperties>
>({});

export const useFlowBuilderSelection = () => useContext(Context);

export const FlowBuilderSelectionProvider = <
  S extends BaseNodeSelectionProperties
>(
  props: FlowBuilderSelectionContext<S> & { children: ReactNode }
) => {
  return <Context.Provider value={props}>{props.children}</Context.Provider>;
};
