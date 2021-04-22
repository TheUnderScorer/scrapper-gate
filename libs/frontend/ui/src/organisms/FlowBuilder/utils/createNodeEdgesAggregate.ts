import {
  BaseNodeProperties,
  NodeEdges,
  NodeEdgesAggregate,
} from '../FlowBuilder.types';

export const createNodeEdgeAggregate = <T extends BaseNodeProperties>({
  edges,
  nodes,
}: NodeEdges<T>): NodeEdgesAggregate<T>[] => {
  const edgesArr = Array.from(edges.values());

  return Array.from(nodes.values()).map((node) => {
    const targetEdges = edgesArr.filter((edge) => edge.target === node.id);
    const sourceEdges = edgesArr.filter((edge) => edge.source === node.id);

    return {
      ...node,
      sourceEdges,
      targetEdges,
    };
  });
};
