import { useCallback } from 'react';
import { EdgeProps, NodeProps, removeElements } from 'react-flow-renderer';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { getById } from '@scrapper-gate/shared/common';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';

export const useRemoveItems = () => {
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);
  const onRemove = useFlowBuilderContextSelector((ctx) => ctx.onRemove);
  const { remove } = useFlowBuilderItemsSelector((ctx) => ctx.field);

  return useCallback(
    (
      itemsToDelete: Array<
        NodeProps<BaseNodeProperties> | EdgeProps<BaseNodeProperties>
      >
    ) => {
      if (!onRemove) {
        return;
      }

      const items = getItems();

      const filteredItemsToDelete = itemsToDelete.filter(
        (item) => !getById(items, item.id).data?.cannotBeDeleted
      );

      // TODO Change "onRemove" param
      const filteredItems = onRemove?.(filteredItemsToDelete, {
        removeElements,
        items,
      });

      const indexes = filteredItemsToDelete.map((itemToDelete) => {
        return items.findIndex((item) => item?.id === itemToDelete.id);
      });

      console.log({ indexes });

      remove(indexes);
    },
    [getItems, onRemove, remove]
  );
};
