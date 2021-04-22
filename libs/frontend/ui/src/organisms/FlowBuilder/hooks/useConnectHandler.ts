import { useCallback } from 'react';
import { ArrowHeadType, Connection, Node, Position } from 'react-flow-renderer';
import { useTheme } from '@material-ui/core';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { getById } from '@scrapper-gate/shared/common';
import { FlowBuilderEdgeTypes } from '../FlowBuilder.types';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';

export const useConnectHandler = () => {
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);
  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);
  const onConnect = useFlowBuilderContextSelector((ctx) => ctx.onConnect);
  const nodeTypes = useFlowBuilderContextSelector((ctx) => ctx.nodeTypes);
  const theme = useTheme();

  return useCallback(
    (params: Connection) => {
      if (!onConnect) {
        return;
      }

      const items = getItems();

      const node = getById(items, params.source) as Node;
      const handlesData = nodeTypes[node.type]?.handlesData;

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

      setItems([...items, edge]);
    },
    [getItems, nodeTypes, onConnect, setItems, theme.palette.primary.dark]
  );
};
