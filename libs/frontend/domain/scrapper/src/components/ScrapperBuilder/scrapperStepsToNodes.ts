import { ScrapperAction } from '@scrapper-gate/shared/schema';
import {
  flowBuilderConstants,
  FlowBuilderItem,
  FlowBuilderNodeTypes,
  flowBuilderUtils,
  NodesCreatorApi,
} from '@scrapper-gate/frontend/ui';
import {
  ScrapperBuilderNodeProperties,
  ScrapperBuilderNodeSelection,
  ScrapperBuilderStep,
} from '@scrapper-gate/frontend/domain/scrapper';
import { scrapperActionNodeTypeMap } from './scrapperActionNodeTypeMap';
import { Selection } from '@scrapper-gate/frontend/common';
import { Node, Position } from 'react-flow-renderer';

export const scrapperStepsToNodes = (
  steps: ScrapperBuilderStep[],
  selections: Selection<ScrapperBuilderNodeSelection>[]
) => async ({
  handleConnect,
  createNode,
}: NodesCreatorApi<
  ScrapperBuilderNodeProperties,
  ScrapperBuilderNodeSelection
>): Promise<FlowBuilderItem<ScrapperBuilderNodeProperties>[]> => {
  const result: FlowBuilderItem<ScrapperBuilderNodeProperties>[] = [];

  if (!steps.length) {
    return [];
  }

  const firstStep = steps.find((step) => !step.previousSteps?.length);

  if (!firstStep) {
    throw new Error('Unable to determine which step is first.');
  }

  for (const step of steps) {
    const selection = selections.find(
      (item) => item.value.action === step.action
    );

    const nodes = await createNode({
      value: {
        id: step.id,
        type:
          scrapperActionNodeTypeMap[step.action] ?? FlowBuilderNodeTypes.Action,
        position: {
          x: step.position?.x ?? 0,
          y: step.position?.y ?? 0,
        },
        ...step,
      },
      label: selection.label,
      icon: selection.icon,
    });

    result.push(...nodes);
  }

  // Iterate again over nodes in order to create edges
  steps.forEach((step) => {
    if (step.nextStep || step.action === ScrapperAction.Condition) {
      if (step.action !== ScrapperAction.Condition) {
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

  const startNode = flowBuilderUtils.createStartNode({
    x: firstNode.position.x - flowBuilderConstants.defaultNodeSize * 2,
    y: firstNode.position.y,
  });

  result.push(startNode);

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
