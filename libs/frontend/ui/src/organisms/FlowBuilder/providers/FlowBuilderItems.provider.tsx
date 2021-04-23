/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Node, useZoomPanHelper } from 'react-flow-renderer';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { useMount, useTimeoutFn } from 'react-use';
import { createContext, useContextSelector } from 'use-context-selector';
import {
  BaseNodeProperties,
  ConnectionSource,
  FlowBuilderFormState,
  FlowBuilderItem,
} from '../FlowBuilder.types';
import { useFormContext } from 'react-hook-form';
import { registerFlowBuilderItem } from '../utils/registerFlowBuilderItem';

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
  getItems: () => {
    throw new Error();
  },
  setItems: () => {
    throw new Error();
  },
  recentlyCreatedNodeIds: [],
  afterCreate: () => {
    throw new Error();
  },
  setConnectionSource: () => {
    throw new Error();
  },
});

export const useFlowBuilderItemsSelector = <Value extends unknown>(
  selector: (context: FlowBuilderItemsContext<BaseNodeProperties>) => Value
) => useContextSelector(Context, selector);

export const FlowBuilderItemsProvider = <T extends BaseNodeProperties>(props: {
  children: ReactNode;
}) => {
  const {
    getValues,
    watch,
    setValue,
    register,
  } = useFormContext<FlowBuilderFormState>();
  // @ts-ignore
  const value = watch('items') as FlowBuilderFormState<T>['items'];

  const setItems = useCallback(
    (items: FlowBuilderItem<T>[]) => {
      setValue('items', items);
    },
    [setValue]
  );

  const getItems = useCallback(() => getValues().items, [getValues]);

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

  useMount(() => {
    value.forEach((item, index) => {
      registerFlowBuilderItem(register, item, index);
    });
  });

  useEffect(() => {
    console.log(value);
  }, [value]);

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
