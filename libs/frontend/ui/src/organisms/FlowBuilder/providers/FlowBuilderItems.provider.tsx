import { Node, useZoomPanHelper } from 'react-flow-renderer';
import React, { ReactNode, useCallback, useState } from 'react';
import { useTimeoutFn } from 'react-use';
import { useField, useForm } from 'react-final-form';
import { createContext, useContextSelector } from 'use-context-selector';
import {
  BaseNodeProperties,
  ConnectionSource,
  FlowBuilderItem,
} from '@scrapper-gate/frontend/ui';
import { throwError } from '@scrapper-gate/shared/common';

export interface FlowBuilderItemsContext<T extends BaseNodeProperties> {
  items: FlowBuilderItem<T>[];
  // Preferred alternative to "items" above, since it can be triggered inside callback, and it won't cause unnecessary re-renders
  getItems: () => FlowBuilderItem<T>[];
  setItems: (items: FlowBuilderItem<T>[]) => unknown;
  recentlyCreatedNodeIds?: string[];
  connectionSource?: ConnectionSource;
  setConnectionSource: (source: ConnectionSource) => unknown;
  afterCreate: (
    values: string[],
    items: FlowBuilderItem<T>[],
    nodeToCenterOn?: Node
  ) => unknown;
}

const Context = createContext<FlowBuilderItemsContext<unknown>>({
  items: [],
  getItems: throwError(),
  setItems: throwError(),
  recentlyCreatedNodeIds: [],
  afterCreate: throwError(),
  setConnectionSource: throwError(),
});

export const useFlowBuilderItemsSelector = <Value extends unknown>(
  selector: (context: FlowBuilderItemsContext<BaseNodeProperties>) => Value
) => useContextSelector(Context, selector);

export const FlowBuilderItemsProvider = <T extends BaseNodeProperties>(props: {
  children: ReactNode;
}) => {
  const {
    input: { value, onChange },
  } = useField<FlowBuilderItem<T>[]>('items');

  const { getState } = useForm();

  const getItems = useCallback(() => getState().values.items, [getState]);

  const zoomHelper = useZoomPanHelper();

  const [recentlyCreatedNodeIds, setRecentlyCreatedNodeIds] = useState([]);
  const [connectionSource, setConnectionSource] = useState<
    ConnectionSource | undefined
  >();

  const [, , resetTimeout] = useTimeoutFn(
    () => setRecentlyCreatedNodeIds([]),
    1500
  );

  const afterCreate = useCallback(
    (
      addedNodes: string[],
      items: FlowBuilderItem<T>[],
      nodeToCenterOn?: Node
    ) => {
      if (nodeToCenterOn) {
        zoomHelper.setCenter(
          nodeToCenterOn.position.x,
          nodeToCenterOn.position.y,
          1
        );
      }

      setRecentlyCreatedNodeIds(addedNodes);

      resetTimeout();
    },
    [resetTimeout, zoomHelper]
  );

  return (
    <Context.Provider
      value={{
        ...props,
        getItems,
        items: value,
        setItems: onChange,
        recentlyCreatedNodeIds,
        afterCreate,
        setConnectionSource,
        connectionSource,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
