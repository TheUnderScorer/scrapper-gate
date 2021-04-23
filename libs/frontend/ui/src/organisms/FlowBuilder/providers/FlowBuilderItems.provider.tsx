/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Node, useZoomPanHelper } from 'react-flow-renderer';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTimeoutFn } from 'react-use';
import { createContext, useContextSelector } from 'use-context-selector';
import {
  BaseNodeProperties,
  ConnectionSource,
  FlowBuilderFormState,
  FlowBuilderItem,
} from '../FlowBuilder.types';
import {
  useFieldArray,
  UseFieldArrayReturn,
  useFormContext,
} from 'react-hook-form';
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
  registerItems: () => void;
  field: UseFieldArrayReturn;
}

const Context = createContext<FlowBuilderItemsContext<unknown>>({
  items: [],
  getItems: throwError(),
  setItems: throwError(),
  recentlyCreatedNodeIds: [],
  afterCreate: throwError(),
  setConnectionSource: throwError(),
  registerItems: throwError(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: {} as any,
});

export const useFlowBuilderItemsSelector = <Value extends unknown>(
  selector: (context: FlowBuilderItemsContext<BaseNodeProperties>) => Value
) => useContextSelector(Context, selector);

export const FlowBuilderItemsProvider = <T extends BaseNodeProperties>(props: {
  children: ReactNode;
}) => {
  const {
    getValues,
    setValue,
    register,
  } = useFormContext<FlowBuilderFormState>();

  const field = useFieldArray({
    name: 'items',
  });
  const value = field.fields as FlowBuilderItem<T>[];
  const mappedValue = useMemo(() => {
    return value.map((value, index) => ({
      ...value,
      data: {
        ...value?.data,
        index,
      },
    }));
  }, [value]);

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

  const registerItems = useCallback(() => {
    getValues().items.forEach((item, index) => {
      register(`items.${index}` as const);
    });
  }, [getValues, register]);

  useEffect(() => {
    console.log(mappedValue);
  }, [mappedValue]);

  return (
    <Context.Provider
      value={{
        ...props,
        getItems,
        items: mappedValue,
        setItems,
        recentlyCreatedNodeIds,
        afterCreate,
        setConnectionSource,
        connectionSource,
        registerItems,
        field,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
