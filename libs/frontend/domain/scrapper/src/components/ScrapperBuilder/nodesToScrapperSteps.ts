import {
  ConditionalNodeEdgeType,
  FlowBuilderItem,
  FlowBuilderNodeTypes,
  flowBuilderUtils,
} from '@scrapper-gate/frontend/ui';
import {
  ScrapperAction,
  ScrapperStepInput,
} from '@scrapper-gate/shared/schema';
import { getById } from '@scrapper-gate/shared/common';
import { getOutgoers, isNode, Node } from 'react-flow-renderer';
import { pickScrapperInput } from '@scrapper-gate/shared/domain/scrapper';
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

export const nodesToScrapperSteps = (
  nodes: FlowBuilderItem<ScrapperBuilderNodeProperties>[]
): ScrapperStepInput[] => {
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
