import { useCallback } from 'react';
import { EdgeProps, NodeProps, removeElements } from 'react-flow-renderer';
import { useFlowBuilderActiveNodeSelector } from '../providers/FlowBuilderActiveNode.provider';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { getById } from '@scrapper-gate/shared/common';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';

export const useRemoveItems = () => {
  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);
  const onRemove = useFlowBuilderContextSelector((ctx) => ctx.onRemove);

  const [
    activeNodeId,
    setActiveNodeId,
  ] = useFlowBuilderActiveNodeSelector((ctx) => [
    ctx.activeNodeId,
    ctx.setActiveNodeId,
  ]);

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
      const includesActiveNode = activeNodeId
        ? Boolean(itemsToDelete.find((item) => item.id === activeNodeId))
        : false;

      console.log({
        activeNodeId,
        itemsToDelete,
        includesActiveNode,
      });

      const filteredItems = onRemove?.(
        itemsToDelete.filter(
          (item) => !getById(items, item.id)?.data?.cannotBeDeleted
        ),
        {
          removeElements,
          items,
        }
      );

      if (includesActiveNode) {
        setActiveNodeId(undefined);
      }

      setItems(filteredItems);
    },
    [activeNodeId, getItems, onRemove, setActiveNodeId, setItems]
  );
};
