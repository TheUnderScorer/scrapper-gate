import { NodeLikeItem } from '@scrapper-gate/shared/schema';
import {
  BaseNodeProperties,
  BaseNodeSelectionProperties,
  FlowBuilderItem,
  FlowBuilderNodeTypes,
  NodesCreatorApi,
} from '@scrapper-gate/frontend/ui';
import { Node, Position } from 'react-flow-renderer';
import { Selection } from '@scrapper-gate/frontend/common';
import { createStartNode } from './createStartNode';
import { defaultNodeSize } from '../nodeTypes/constants';

export interface RecreateNodesParams<
  T extends NodeLikeItem,
  S extends BaseNodeSelectionProperties,
  N extends BaseNodeProperties
> {
  items: T[];
  selections: Selection<S>[];
  findSelectionForItem: (item: T, selections: Selection<S>[]) => Selection<S>;
}

export const recreateNodes = <
  T extends NodeLikeItem,
  S extends BaseNodeSelectionProperties,
  N extends BaseNodeProperties
>({
  findSelectionForItem,
  items,
  selections,
}: RecreateNodesParams<T, S, N>) => async ({
  handleConnect,
  createNode,
}: NodesCreatorApi<BaseNodeProperties, BaseNodeSelectionProperties>) => {
  const result: FlowBuilderItem<N>[] = [];

  if (!items.length) {
    return [];
  }

  const firstStep = items.find((step) => !step.previousSteps?.length);

  if (!firstStep) {
    throw new Error('Unable to determine which step is first.');
  }

  for (const item of items) {
    const selection = findSelectionForItem(item, selections);

    const nodes = (await createNode({
      value: {
        id: item.id,
        ...item,
        type: item.type ?? FlowBuilderNodeTypes.Action,
        position: {
          x: item.position?.x ?? 0,
          y: item.position?.y ?? 0,
        },
      },
      label: selection.label,
      icon: selection.icon,
    })) as Node<N>[];

    result.push(...nodes);
  }

  // Iterate again over nodes in order to create edges
  items.forEach((step) => {
    if (step.nextStep || step.type === FlowBuilderNodeTypes.Conditional) {
      if (step.type !== FlowBuilderNodeTypes.Conditional) {
        const edge = handleConnect(
          {
            source: step.id,
            target: step.nextStep.id,
            sourceHandle: Position.Right,
            targetHandle: null,
          },
          result
        );

        result.push(edge);
      } else {
        if (step.stepOnTrue) {
          result.push(
            handleConnect(
              {
                source: step.id,
                target: step.stepOnTrue.id,
                sourceHandle: Position.Top,
                targetHandle: null,
              },
              result
            )
          );
        }

        if (step.stepOnFalse) {
          result.push(
            handleConnect(
              {
                source: step.id,
                target: step.stepOnFalse.id,
                sourceHandle: Position.Bottom,
                targetHandle: null,
              },
              result
            )
          );
        }
      }
    }
  });

  const firstNode = result.find((node) => node.id === firstStep.id) as Node;

  const startNode = createStartNode({
    x: firstNode.position.x - defaultNodeSize * 2,
    y: firstNode.position.y,
  });

  result.push(startNode as Node);

  result.push(
    handleConnect(
      {
        source: startNode.id,
        target: firstNode.id,
        sourceHandle: Position.Right,
        targetHandle: null,
      },
      result
    )
  );

  return result;
};
