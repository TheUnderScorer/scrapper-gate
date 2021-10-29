import { getIncomers, getOutgoers, Node } from 'react-flow-renderer';
import { BaseNodeProperties, FlowBuilderItem } from '../FlowBuilder.types';

interface TravelNodesParams<T extends BaseNodeProperties> {
  node: Node<T>;
  items: FlowBuilderItem<T>[];
  direction: 'in' | 'out';
  callback: (node: Node<T>) => boolean;
}

export const travelNodes = <T extends BaseNodeProperties>({
  node,
  items,
  direction,
  callback,
}: TravelNodesParams<T>) => {
  const connectedNodes: Node<T>[] =
    direction === 'in' ? getIncomers(node, items) : getOutgoers(node, items);

  if (!connectedNodes.length) {
    return;
  }

  for (const connectedNode of connectedNodes) {
    if (callback(connectedNode)) {
      return;
    }

    travelNodes({
      node: connectedNode,
      items,
      direction,
      callback,
    });
  }
};
