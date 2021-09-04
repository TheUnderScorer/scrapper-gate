import { isNode } from 'react-flow-renderer';
import {
  BaseNodeProperties,
  FlowBuilderItem,
  NodeEdges,
} from '../FlowBuilder.types';

export const splitNodesAndEdges = <T extends BaseNodeProperties>(
  items: FlowBuilderItem<T>[]
): NodeEdges<T> => {
  const nodeEdges = items.reduce(
    (acc, item) => {
      if (isNode(item)) {
        acc.nodes.set(item.id, item);

        return acc;
      }

      acc.edges.set(item.id, item);

      return acc;
    },
    {
      nodes: new Map(),
      edges: new Map(),
    }
  );

  return {
    ...nodeEdges,
    items,
  };
};
