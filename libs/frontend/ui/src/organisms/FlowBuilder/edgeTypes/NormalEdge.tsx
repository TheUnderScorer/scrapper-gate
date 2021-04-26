import React, { useCallback, useMemo } from 'react';
import {
  Edge,
  EdgeProps,
  getBezierPath,
  getMarkerEnd,
  getSmoothStepPath,
} from 'react-flow-renderer';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
  FlowBuilderItemsContext,
  useFlowBuilderItemsSelector,
} from '../providers/FlowBuilderItems.provider';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { getById } from '@scrapper-gate/shared/common';
import { NormalEdgeVariations } from './NormalEdge.types';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { elseBranch, when } from '@theunderscorer/when';

export interface NormalEdgeProps
  extends Pick<
      EdgeProps<BaseNodeProperties>,
      | 'id'
      | 'sourceX'
      | 'sourceY'
      | 'targetY'
      | 'targetX'
      | 'arrowHeadType'
      | 'markerEndId'
      | 'label'
      | 'sourcePosition'
      | 'targetPosition'
      | 'data'
    >,
    Pick<Partial<EdgeProps<BaseNodeProperties>>, 'source' | 'sourceHandleId'> {
  variant?: NormalEdgeVariations;
}

const useStyles = makeStyles((theme) => ({
  text: {
    ...theme.typography.body1,
  },
  path: {
    stroke: theme.palette.primary.dark,
  },
}));

export const NormalEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  arrowHeadType,
  markerEndId,
  label,
  sourcePosition,
  variant,
  targetPosition,
  source,
  sourceHandleId,
  data,
}: NormalEdgeProps) => {
  const nodeSelector = useCallback(
    (ctx: FlowBuilderItemsContext<BaseNodeProperties>) => {
      return source ? getById(ctx.items, source) : null;
    },
    [source]
  );
  const node = useFlowBuilderItemsSelector(nodeSelector);

  const nodeTypes = useFlowBuilderContextSelector((ctx) => ctx.nodeTypes);

  const handleData = useMemo<Partial<Edge<BaseNodeProperties>> | null>(() => {
    const handleId = sourceHandleId ?? data?.sourceHandle;

    if (!node || !handleId) {
      return null;
    }

    if (!node || !nodeTypes[node.type]) {
      return null;
    }

    return nodeTypes[node.type]?.handlesData?.[handleId] ?? null;
  }, [sourceHandleId, data, node, nodeTypes]);

  const variantValue = variant ?? handleData?.data?.edgeVariation;
  const labelValue = label ?? handleData?.label;

  const path = useMemo(() => {
    return when(variantValue, {
      [NormalEdgeVariations.SmoothStep]: () =>
        getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
        }),
      [NormalEdgeVariations.Bezier]: () =>
        getBezierPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
        }),
      [elseBranch]: () =>
        `M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`,
    });
  }, [
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY,
    variantValue,
  ]);

  const classes = useStyles();

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <g>
      <path
        id={id}
        strokeWidth={1}
        d={path}
        markerEnd={markerEnd}
        className={classNames('react-flow__edge-path', classes.path)}
      />
      <g>
        <rect y={targetY - 15} x={targetX - 50} />
        <text className={classes.text} y={targetY - 15} x={targetX - 50}>
          {labelValue}
        </text>
      </g>
    </g>
  );
};
