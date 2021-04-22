import React, { useCallback, useMemo } from 'react';
import { Connection, NodeProps } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core/styles';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { useNodeMetadata } from '../hooks/useNodeMetadata';
import { useIsNodeDragged } from '../hooks/useIsNodeDragged';
import { useFlowBuilderActiveNodeSelector } from '../providers/FlowBuilderActiveNode.provider';
import { defaultNodeSize } from './constants';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';

export interface FlowBuilderNodeBoxIconProps {
  node: NodeProps<BaseNodeProperties>;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    '& svg': {
      fontSize: theme.typography.h5.fontSize,
    },
  },
}));

export const FlowBuilderNodeBoxIcon = ({
  node,
}: FlowBuilderNodeBoxIconProps) => {
  const classes = useStyles();

  const {
    data: { icon, onClick },
  } = node;

  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);
  const isValidConnection = useFlowBuilderContextSelector(
    (ctx) => ctx.isValidConnection
  );
  const metaData = useNodeMetadata(node.type);
  const setActiveNodeId = useFlowBuilderActiveNodeSelector(
    (ctx) => ctx.setActiveNodeId
  );
  const isDragged = useIsNodeDragged(node.id);

  const Component = metaData.boxWithIcon;

  const isValidConnectionChecker = useCallback(
    (connection: Connection) => {
      if (!isValidConnection) {
        return true;
      }

      return isValidConnection({
        connection,
        node,
        items: getItems(),
      });
    },
    [isValidConnection, node, getItems]
  );

  const handleClick = useCallback(() => {
    if (isDragged) {
      return;
    }

    setActiveNodeId(node.id);

    onClick?.(node);
  }, [isDragged, node, onClick, setActiveNodeId]);

  const handles = useMemo(
    () =>
      metaData.handles({
        node,
        isValidConnectionChecker,
      }),
    [metaData, node, isValidConnectionChecker]
  );

  return (
    <Component
      width={defaultNodeSize}
      height={defaultNodeSize}
      iconClassName={classes.icon}
      handles={handles}
      icon={icon}
      onClick={handleClick}
    />
  );
};
