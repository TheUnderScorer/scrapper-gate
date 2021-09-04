import { Edge, isEdge } from 'react-flow-renderer';
import { BaseNodeProperties, FlowBuilderItem } from '../FlowBuilder.types';

export enum GetNodeEdgesBehaviour {
  SourceOrTarget,
  Target,
  Source,
}

export const getNodeEdges = <T extends BaseNodeProperties>(
  items: FlowBuilderItem<T>[],
  nodeId: string,
  behaviour: GetNodeEdgesBehaviour = GetNodeEdgesBehaviour.SourceOrTarget
): Edge<T>[] => {
  return items.filter(
    (item) => isEdge(item) && resolveEdge(item, nodeId, behaviour)
  ) as Edge<T>[];
};

const resolveEdge = (
  edge: Edge,
  nodeId: string,
  behaviour: GetNodeEdgesBehaviour
) => {
  switch (behaviour) {
    case GetNodeEdgesBehaviour.Source:
      return edge.source === nodeId;

    case GetNodeEdgesBehaviour.Target:
      return edge.target === nodeId;

    default:
      return edge.source === nodeId || edge.target === nodeId;
  }
};
