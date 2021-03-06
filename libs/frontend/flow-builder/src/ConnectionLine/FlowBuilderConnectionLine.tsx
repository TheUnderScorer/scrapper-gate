/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import {
  ArrowHeadType,
  ConnectionLineComponentProps,
} from 'react-flow-renderer';
import { NormalEdge } from '../edgeTypes/NormalEdge';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';

export type ConnectionLineProps = ConnectionLineComponentProps;

export const FlowBuilderConnectionLine = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  targetPosition,
  sourcePosition,
}: ConnectionLineProps) => {
  const connectionSource = useFlowBuilderItemsSelector(
    (ctx) => ctx.connectionSource
  );

  return (
    <NormalEdge
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      id="connection_line"
      arrowHeadType={
        connectionSource?.handleType === 'target'
          ? undefined
          : ArrowHeadType.ArrowClosed
      }
      sourcePosition={sourcePosition!}
      targetPosition={targetPosition!}
      source={connectionSource?.nodeId ?? ''}
      target=""
      sourceHandleId={connectionSource?.handleId}
    />
  );
};
