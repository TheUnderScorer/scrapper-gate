import { Node, useZoomPanHelper } from 'react-flow-renderer';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTimeoutFn } from 'react-use';
import { useField, useForm } from 'react-final-form';
import { createContext, useContextSelector } from 'use-context-selector';
import {
  BaseNodeProperties,
  ConnectionSource,
  FlowBuilderFormState,
  FlowBuilderItem,
} from '@scrapper-gate/frontend/ui';
import { throwError } from '@scrapper-gate/shared/common';
import { useFlowBuilderContextSelector } from './FlowBuilderProps.provider';

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
  const onChange = useFlowBuilderContextSelector((ctx) => ctx.onChange);

  const {
    input: { value },
  } = useField<FlowBuilderItem<T>[]>('items');

  const { getState, change } = useForm<FlowBuilderFormState>();

  const setItems = useCallback(
    (items: FlowBuilderItem<T>[]) => {
      change('items', items);
    },
    [change]
  );

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

  useEffect(() => {
    onChange?.(value);
  }, [onChange, value]);

  return (
    <Context.Provider
      value={{
        ...props,
        getItems,
        items: value,
        setItems,
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
