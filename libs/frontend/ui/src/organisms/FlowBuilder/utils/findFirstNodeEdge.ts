import { BaseNodeProperties, NodeEdges } from '../FlowBuilder.types';
import { mapToArray } from '@scrapper-gate/shared/common';

export const findFirstNodeEdge = <T extends BaseNodeProperties>({
  nodes,
  edges,
}: NodeEdges<T>) => {
  const edgesArr = Array.from(edges.values());

  return Array.from(edges.values()).reduce(
    (acc, edge) => {
      const target = edgesArr.find(
        (otherEdge) => otherEdge.target === edge.source
      );

      const node = nodes.get(edge.source);

      if (!target && node) {
        return {
          edge,
          node: node,
        };
      }

      return acc;
    },
    {
      node: mapToArray(nodes)[0],
      edge: mapToArray(edges)[0],
    }
  );
};
