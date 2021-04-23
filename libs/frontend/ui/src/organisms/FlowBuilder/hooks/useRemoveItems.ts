import { useCallback } from 'react';
import { EdgeProps, NodeProps, removeElements } from 'react-flow-renderer';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { getById } from '@scrapper-gate/shared/common';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';

export const useRemoveItems = () => {
  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);
  const onRemove = useFlowBuilderContextSelector((ctx) => ctx.onRemove);

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

      const filteredItems = onRemove?.(
        itemsToDelete.filter(
          (item) => !getById(items, item.id).data?.cannotBeDeleted
        ),
        {
          removeElements,
          items,
        }
      );

      setItems(filteredItems);
    },
    [getItems, onRemove, setItems]
  );
};
