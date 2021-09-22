import { styled } from '@mui/material/styles';
import { getById } from '@scrapper-gate/shared/common';
import { elseBranch, when } from '@theunderscorer/when';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import {
  Edge,
  EdgeProps,
  getBezierPath,
  getMarkerEnd,
  getSmoothStepPath,
} from 'react-flow-renderer';
import { BaseNodeProperties } from '../FlowBuilder.types';
import {
  FlowBuilderItemsContext,
  useFlowBuilderItemsSelector,
} from '../providers/FlowBuilderItems.provider';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { NormalEdgeVariations } from './NormalEdge.types';

const PREFIX = 'NormalEdge';

const classes = {
  text: `${PREFIX}-text`,
  path: `${PREFIX}-path`,
};

const Root = styled('g')(({ theme }) => ({
  [`& .${classes.text}`]: {
    ...theme.typography.body1,
  },

  [`& .${classes.path}`]: {
    stroke: theme.palette.primary.dark,
  },
}));

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
      | 'target'
    >,
    Pick<Partial<EdgeProps<BaseNodeProperties>>, 'source' | 'sourceHandleId'> {
  variant?: NormalEdgeVariations;
}

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
  target,
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

    if (!node?.type || !handleId || !nodeTypes?.[node.type]) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return nodeTypes?.[node.type]?.handlesData?.[handleId] ?? null;
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

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <Root id={`edge-${id}`}>
      <path
        data-target={target}
        data-source={source}
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
    </Root>
  );
};
