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
  setDraggedNode: (node: Node<T> | null) => unknown;
}

const Context = createContext<FlowBuilderDragStateContext<BaseNodeProperties>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  {} as any
);

export const useFlowBuilderDragState = () => useContext(Context);
export const useFlowBuilderDragStateSelector = <Value extends unknown>(
  selector: (ctx: FlowBuilderDragStateContext<unknown>) => Value
) => useContextSelector(Context, selector);

export const FlowBuilderDragStateProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [
    draggedNode,
    setDraggedNode,
  ] = useState<Node<BaseNodeProperties> | null>(null);

  return (
    <Context.Provider value={{ draggedNode, setDraggedNode }}>
      {children}
    </Context.Provider>
  );
};
