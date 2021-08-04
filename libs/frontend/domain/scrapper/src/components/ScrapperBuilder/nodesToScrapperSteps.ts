import {
  ConditionalNodeEdgeType,
  FlowBuilderItem,
  FlowBuilderNodeTypes,
  flowBuilderUtils,
} from '@scrapper-gate/frontend/ui';
import { first, getById } from '@scrapper-gate/shared/common';
import { pickScrapperInput } from '@scrapper-gate/shared/domain/scrapper';
import {
  ScrapperAction,
  ScrapperStepInput,
} from '@scrapper-gate/shared/schema';
import { Edge, getOutgoers, isEdge, isNode, Node } from 'react-flow-renderer';
import { ScrapperBuilderNodeProperties } from './ScrapperBuilder.types';

const allowedNodeTypes = [
  FlowBuilderNodeTypes.Action,
  FlowBuilderNodeTypes.Conditional,
];

const handleConditionalNodes = (
  nodes: FlowBuilderItem<ScrapperBuilderNodeProperties>[],
  step: ScrapperStepInput
) => {
  const edges = flowBuilderUtils.getNodeEdges(nodes, step.id);

  step.stepIdOnTrue = edges.find(
    (edge) => edge.data?.conditionalType === ConditionalNodeEdgeType.True
  )?.target;
  step.stepIdOnFalse = edges.find(
    (edge) => edge.data?.conditionalType === ConditionalNodeEdgeType.False
  )?.target;

  return step;
};

const findFirstNode = (
  nodes: FlowBuilderItem<ScrapperBuilderNodeProperties>[]
) => {
  if (nodes.length === 1) {
    return first(nodes);
  }

  const startNode = nodes.find(
    (node) => node.type === FlowBuilderNodeTypes.Start
  );
  const startEdge = nodes.find(
    (item) => isEdge(item) && item.source === startNode?.id
  ) as Edge;

  return nodes.find((item) => item.id === startEdge?.target);
};

export const nodesToScrapperSteps = (
  nodes: FlowBuilderItem<ScrapperBuilderNodeProperties>[]
): ScrapperStepInput[] => {
  const firstNode = findFirstNode(nodes);

  if (!firstNode) {
    throw new Error('Failed to find first node.');
  }

  const rawSteps: ScrapperStepInput[] = nodes
    .filter(
      (item) =>
        isNode(item) &&
        allowedNodeTypes.includes(item.type as FlowBuilderNodeTypes)
    )
    .map((node) => {
      return pickScrapperInput({
        ...node.data,
        position: (node as Node<ScrapperBuilderNodeProperties>).position,
        id: node.id,
        isFirst: node.id === firstNode.id,
      });
    });

  return rawSteps.map((step) => {
    const node = getById(nodes, step.id);

    const outgoers = getOutgoers(node as Node, nodes);

    if (!outgoers.length) {
      return step;
    }

    if (node?.data?.action !== ScrapperAction.Condition) {
      step.nextStepId = outgoers[0].id;

      return step;
    }

    return handleConditionalNodes(nodes, step);
  });
};
