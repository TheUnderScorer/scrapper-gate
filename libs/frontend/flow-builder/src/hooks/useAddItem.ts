import { useCallback } from 'react';
import { NodeProps, XYPosition } from 'react-flow-renderer';
import { useFlowBuilderInstanceContext } from '../providers/FlowBuilderInstance.provider';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { BaseNodeSelectionProperties } from '../FlowBuilder.types';
import { filterForNodes, getFurthestNode } from '../utils/filter';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { Selection } from '@scrapper-gate/frontend/common';

export interface AddItemArgs {
  source?: NodeProps;
  position?: XYPosition;
  setItemsAfter?: boolean;
}

export const useAddItem = () => {
  const onAdd = useFlowBuilderContextSelector((ctx) => ctx.onAdd);
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);
  const { flowInstance } = useFlowBuilderInstanceContext();
  const afterCreate = useFlowBuilderItemsSelector((ctx) => ctx.afterCreate);
  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);

  return useCallback(
    async (
      item: Selection<BaseNodeSelectionProperties>,
      { position, source, setItemsAfter = true }: AddItemArgs = {}
    ) => {
      if (!onAdd) {
        return;
      }

      const items = getItems();

      const {
        createdNodes,
        items: createdItems,
        nodeToCenterOn,
      } = await onAdd(item, {
        flowInstance,
        items,
        getNodes: () => filterForNodes(items),
        getFurthestNode: getFurthestNode(filterForNodes(items)),
        sourceNode: source,
        position: position ?? item.value.position,
      });

      if (setItemsAfter) {
        setItems([...items, ...(createdNodes ?? [])]);

        afterCreate(
          createdNodes?.map((node) => node.id) ?? [],
          createdItems,
          nodeToCenterOn
        );
      }

      return createdNodes;
    },
    [onAdd, getItems, flowInstance, setItems, afterCreate]
  );
};
