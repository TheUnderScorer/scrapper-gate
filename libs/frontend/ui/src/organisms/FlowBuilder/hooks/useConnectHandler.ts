import { useCallback } from 'react';
import { ArrowHeadType, Connection, Node, Position } from 'react-flow-renderer';
import { useTheme } from '@material-ui/core';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { getById } from '@scrapper-gate/shared/common';
import {
  BaseNodeProperties,
  FlowBuilderEdgeTypes,
  FlowBuilderItem,
} from '../FlowBuilder.types';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';

export interface ConnectionHandlerArgs {
  setItemsAfter?: boolean;
  items?: FlowBuilderItem<BaseNodeProperties>[];
}

export const useConnectHandler = () => {
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);
  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);
  const onConnect = useFlowBuilderContextSelector((ctx) => ctx.onConnect);
  const nodeTypes = useFlowBuilderContextSelector((ctx) => ctx.nodeTypes);
  const theme = useTheme();

  return useCallback(
    (
      params: Connection,
      { items: itemsParam, setItemsAfter = true }: ConnectionHandlerArgs = {}
    ) => {
      if (!onConnect) {
        return;
      }

      const items = itemsParam ?? getItems();

      const node = getById(items, params.source) as Node;

      if (!node.type) {
        return;
      }

      const handlesData = nodeTypes?.[node.type]?.handlesData;

      const edge = onConnect(
        {
          ...params,
        },
        {
          ...handlesData?.[params.sourceHandle as Position],
          arrowHeadType: ArrowHeadType.ArrowClosed,
          style: {
            stroke: theme.palette.primary.dark,
          },
          type: FlowBuilderEdgeTypes.Normal,
        }
      );

      if (setItemsAfter) {
        setItems([...items, edge]);
      }

      return edge;
    },
    // TODO Figure out why this deps cause re-render
    [getItems, nodeTypes, onConnect, setItems, theme.palette.primary.dark]
  );
};
