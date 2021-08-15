import { Perhaps, throwError } from '@scrapper-gate/shared/common';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { useField, useForm } from 'react-final-form';
import { Node, useZoomPanHelper } from 'react-flow-renderer';
import { useTimeoutFn } from 'react-use';
import { createContext, useContextSelector } from 'use-context-selector';
import {
  BaseNodeProperties,
  ConnectionSource,
  FlowBuilderFormState,
  FlowBuilderItem,
} from '../FlowBuilder.types';
import { useFlowBuilderContextSelector } from './FlowBuilderProps.provider';

export interface FlowBuilderItemsContext<T extends BaseNodeProperties> {
  items: FlowBuilderItem<T>[];
  // Preferred alternative to "items" above, since it can be triggered inside callback, and it won't cause unnecessary re-renders
  getItems: () => FlowBuilderItem<T>[];
  setItems: (items: FlowBuilderItem<T>[]) => unknown;
  recentlyCreatedNodeIds?: string[];
  connectionSource?: Perhaps<ConnectionSource>;
  setConnectionSource: (source: Perhaps<ConnectionSource>) => unknown;
  nodesRecreated: boolean;
  setNodesRecreated: (recreated: boolean) => unknown;
  afterCreate: (
    values: string[],
    items: FlowBuilderItem<T>[],
    nodeToCenterOn?: Node
  ) => unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Context = createContext<FlowBuilderItemsContext<any>>({
  items: [],
  getItems: throwError(),
  setItems: throwError(),
  recentlyCreatedNodeIds: [],
  afterCreate: throwError(),
  setConnectionSource: throwError(),
  nodesRecreated: false,
  setNodesRecreated: throwError(),
});

export const useFlowBuilderItemsSelector = <Value extends unknown>(
  selector: (context: FlowBuilderItemsContext<BaseNodeProperties>) => Value
) => useContextSelector(Context, selector);

export const FlowBuilderItemsProvider = <T extends BaseNodeProperties>(props: {
  children: ReactNode;
}) => {
  const [nodesRecreated, setNodesRecreated] = useState(false);

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

  const getItems = useCallback(() => getState().values.items ?? [], [getState]);

  const zoomHelper = useZoomPanHelper();

  const [recentlyCreatedNodeIds, setRecentlyCreatedNodeIds] = useState<
    string[]
  >([]);
  const [connectionSource, setConnectionSource] =
    useState<Perhaps<ConnectionSource>>();

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
        nodesRecreated,
        setNodesRecreated,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
