import { elseBranch, when } from '@theunderscorer/when';
import {
  FlowBuilderFormState,
  FlowBuilderNodeTypes,
} from '../FlowBuilder.types';
import { getNodeEdges, GetNodeEdgesBehaviour } from '../utils/getNodeEdges';
import { mapToArray } from '@scrapper-gate/shared/common';
import { splitNodesAndEdges } from '../utils/splitNodesAndEdges';

export const ensureAllNodesAreConnected = ({ items }: FlowBuilderFormState) => {
  if (items.length <= 1) {
    return {};
  }

  const { nodes, edges } = splitNodesAndEdges(items);

  const edgesArray = mapToArray(edges);

  const nodesWithoutEdges = mapToArray(nodes).filter(
    (node) =>
      !getNodeEdges(
        edgesArray,
        node.id,
        when(node.type, {
          ...getNodeBehaviourMap,
          [elseBranch]: GetNodeEdgesBehaviour.SourceOrTarget,
        })
      ).length
  );

  if (nodesWithoutEdges.length) {
    return {
      invalidNodes: nodesWithoutEdges.reduce((acc, node) => {
        acc[node.id] = new Error('This step must be connected to other step.');

        return acc;
      }, {}),
    };
  }

  return {};
};

const getNodeBehaviourMap = {
  [FlowBuilderNodeTypes.Start]: GetNodeEdgesBehaviour.Source,
  [FlowBuilderNodeTypes.Action]: GetNodeEdgesBehaviour.Target,
};
