import { stopPropagation } from '@scrapper-gate/frontend/common';
import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { NormalEdgeVariations } from '../edgeTypes/NormalEdge.types';
import {
  BaseNodeProperties,
  BoxWithIconComponent,
  ConditionalNodeEdgeType,
  FlowBuilderNodeTypes,
  NodeMetadata,
} from '../FlowBuilder.types';
import { ActionNodeBox } from './boxes/ActionNodeBox';
import { ConditionalNodeBox } from './boxes/ConditionalNodeBox';
import { EndNodeBox } from './boxes/EndNodeBox';
import { StartNodeBox } from './boxes/StartNodeBox';
import { ConditionalNodeHandles } from './handles/ConditionalNodeHandles';

export const nodeTypes: Record<
  FlowBuilderNodeTypes,
  NodeMetadata<BaseNodeProperties>
> = {
  [FlowBuilderNodeTypes.Start]: {
    handles: ({ isValidConnectionChecker }) => (
      <Handle
        onClick={stopPropagation}
        isValidConnection={isValidConnectionChecker}
        isConnectable
        type="source"
        id={Position.Right}
        position={Position.Right}
      />
    ),
    boxWithIcon: StartNodeBox as BoxWithIconComponent,
    handlesData: {
      [Position.Right]: {
        data: {
          edgeVariation: NormalEdgeVariations.Bezier,
        },
      },
    },
  },
  [FlowBuilderNodeTypes.End]: {
    handles: ({ isValidConnectionChecker }) => (
      <Handle
        onClick={stopPropagation}
        isConnectable
        isValidConnection={isValidConnectionChecker}
        type="target"
        id={Position.Left}
        position={Position.Left}
      />
    ),
    boxWithIcon: EndNodeBox as BoxWithIconComponent,
  },
  [FlowBuilderNodeTypes.Conditional]: {
    boxWithIcon: ConditionalNodeBox,
    handles: (bag) => <ConditionalNodeHandles {...bag} />,
    handlesData: {
      [Position.Top]: {
        label: 'If true',
        data: {
          edgeVariation: NormalEdgeVariations.Normal,
          conditionalType: ConditionalNodeEdgeType.True,
        },
      },
      [Position.Bottom]: {
        label: 'If false',
        data: {
          edgeVariation: NormalEdgeVariations.Normal,
          conditionalType: ConditionalNodeEdgeType.False,
        },
      },
    },
  },
  [FlowBuilderNodeTypes.Action]: {
    boxWithIcon: ActionNodeBox,
    handles: ({
      node: {
        data: { isFirst, isLast, sourcePosition, targetPosition },
      },
      isValidConnectionChecker,
    }) => (
      <>
        {!isFirst && (
          <Handle
            onClick={stopPropagation}
            id={targetPosition ?? Position.Left}
            isValidConnection={isValidConnectionChecker}
            isConnectable
            type="target"
            position={targetPosition ?? Position.Left}
          />
        )}
        {!isLast && (
          <Handle
            onClick={stopPropagation}
            isValidConnection={isValidConnectionChecker}
            isConnectable
            type="source"
            position={sourcePosition ?? Position.Right}
            id={sourcePosition ?? Position.Right}
          />
        )}
      </>
    ),
    handlesData: {
      [Position.Right]: {
        data: {
          edgeVariation: NormalEdgeVariations.Bezier,
        },
      },
      [Position.Left]: {
        data: {
          edgeVariation: NormalEdgeVariations.Bezier,
        },
      },
    },
  },
};
