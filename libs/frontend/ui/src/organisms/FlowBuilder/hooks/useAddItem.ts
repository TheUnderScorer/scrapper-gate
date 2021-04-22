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
      { position, source }: AddItemArgs = {}
    ) => {
      if (!onAdd) {
        return;
      }

      const items = getItems();

      const { createdNodes, items: createdItems, nodeToCenterOn } = await onAdd(
        item,
        {
          flowInstance: flowInstance!,
          items,
          getNodes: () => filterForNodes(items),
          getFurthestNode: getFurthestNode(filterForNodes(items)),
          sourceNode: source,
          position,
        }
      );

      setItems([...items, ...createdNodes]);

      afterCreate(
        createdNodes?.map((node) => node.id) ?? [],
        createdItems,
        nodeToCenterOn
      );
    },
    [onAdd, getItems, flowInstance, setItems, afterCreate]
  );
};
