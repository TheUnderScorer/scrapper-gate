import { useCallback } from 'react';
import { NodeProps, XYPosition } from 'react-flow-renderer';
import { useFlowBuilderInstanceContext } from '../providers/FlowBuilderInstance.provider';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import {
  BaseNodeSelectionProperties,
  FlowBuilderFormState,
} from '../FlowBuilder.types';
import { filterForNodes, getFurthestNode } from '../utils/filter';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { Selection } from '@scrapper-gate/frontend/common';
import { registerFlowBuilderItem } from '../utils/registerFlowBuilderItem';
import { useFormContext } from 'react-hook-form';
import { forEachObj } from 'remeda';

export interface AddItemArgs {
  source?: NodeProps;
  position?: XYPosition;
}

export const useAddItem = () => {
  const onAdd = useFlowBuilderContextSelector((ctx) => ctx.onAdd);
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);
  const { flowInstance } = useFlowBuilderInstanceContext();
  const afterCreate = useFlowBuilderItemsSelector((ctx) => ctx.afterCreate);
  const { append } = useFlowBuilderItemsSelector((ctx) => ctx.field);

  const { register } = useFormContext();

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
          flowInstance,
          items,
          getNodes: () => filterForNodes(items),
          getFurthestNode: getFurthestNode(filterForNodes(items)),
          sourceNode: source,
          position,
        }
      );

      append(createdNodes, {
        shouldFocus: false,
      });

      afterCreate(
        createdNodes?.map((node) => node.id) ?? [],
        createdItems,
        nodeToCenterOn
      );
    },

    [onAdd, getItems, flowInstance, afterCreate, append]
  );
};
