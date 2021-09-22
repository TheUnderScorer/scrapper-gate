import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { Connection, NodeProps } from 'react-flow-renderer';
import { BaseNodeProperties } from '../../FlowBuilder.types';
import { useNodeMetadata } from '../../hooks/useNodeMetadata';
import { defaultNodeSize } from '../../nodeTypes/constants';
import { useFlowBuilderActiveNodeSelector } from '../../providers/FlowBuilderActiveNode.provider';
import { useFlowBuilderItemsSelector } from '../../providers/FlowBuilderItems.provider';
import { useFlowBuilderContextSelector } from '../../providers/FlowBuilderProps.provider';

const PREFIX = 'FlowBuilderNodeBoxIcon';

const classes = {
  icon: `${PREFIX}-icon`,
};

export interface FlowBuilderNodeBoxIconProps {
  node: NodeProps<BaseNodeProperties>;
}

export const FlowBuilderNodeBoxIcon = ({
  node,
}: FlowBuilderNodeBoxIconProps) => {
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

  const Component = metaData.boxWithIcon;
  const StyledComponent = useMemo(
    () =>
      styled(Component)(({ theme }) => ({
        [`& .${classes.icon}`]: {
          '& svg': {
            fontSize: theme.typography.h4.fontSize,
          },
        },
      })),
    [Component]
  );

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

  const handleDoubleClick = useCallback(() => {
    setActiveNodeId(node.id);

    onClick?.(node);
  }, [node, onClick, setActiveNodeId]);

  const handles = useMemo(
    () =>
      metaData.handles({
        node,
        isValidConnectionChecker,
      }),
    [metaData, node, isValidConnectionChecker]
  );

  return (
    <StyledComponent
      width={defaultNodeSize}
      height={defaultNodeSize}
      iconClassName={classes.icon}
      handles={handles}
      icon={icon}
      onDoubleClick={handleDoubleClick}
    />
  );
};
