import { Maybe, throwError } from '@scrapper-gate/shared/common';
import React, { PropsWithChildren, useState } from 'react';
import { Node } from 'react-flow-renderer';
import {
  createContext,
  useContext,
  useContextSelector,
} from 'use-context-selector';
import { BaseNodeProperties } from '../FlowBuilder.types';

export interface FlowBuilderDragStateContext<T extends BaseNodeProperties> {
  draggedNode?: Maybe<Node<T>>;
  setDraggedNode: (node: Node<T> | null) => unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Context = createContext<FlowBuilderDragStateContext<any>>({
  draggedNode: null,
  setDraggedNode: throwError(),
});

export const useFlowBuilderDragState = () => useContext(Context);
export const useFlowBuilderDragStateSelector = <
  Value extends unknown,
  T extends BaseNodeProperties
>(
  selector: (ctx: FlowBuilderDragStateContext<T>) => Value
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
