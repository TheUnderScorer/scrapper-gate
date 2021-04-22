import { Node } from 'react-flow-renderer';
import React, { PropsWithChildren, useState } from 'react';
import {
  createContext,
  useContext,
  useContextSelector,
} from 'use-context-selector';
import { BaseNodeProperties } from '../FlowBuilder.types';

export interface FlowBuilderDragStateContext<T extends BaseNodeProperties> {
  draggedNode?: Node<T>;
  setDraggedNode: (node: Node<T> | null) => any;
}

const Context = createContext<FlowBuilderDragStateContext<any>>({} as any);

export const useFlowBuilderDragState = () => useContext(Context);
export const useFlowBuilderDragStateSelector = <Value extends any>(
  selector: (ctx: FlowBuilderDragStateContext<any>) => Value
) => useContextSelector(Context, selector);

export const FlowBuilderDragStateProvider = <T extends BaseNodeProperties>({
  children,
}: PropsWithChildren<unknown>) => {
  const [draggedNode, setDraggedNode] = useState<Node<T> | undefined>();

  return (
    <Context.Provider value={{ draggedNode, setDraggedNode }}>
      {children}
    </Context.Provider>
  );
};
