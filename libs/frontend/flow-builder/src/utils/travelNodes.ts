import { getIncomers, getOutgoers, Node } from 'react-flow-renderer';
import { BaseNodeProperties, FlowBuilderItem } from '../FlowBuilder.types';

export const travelNodes = <T extends BaseNodeProperties>(
  node: Node<T>,
  items: FlowBuilderItem<T>[],
  direction: 'in' | 'out',
  callback: (node: Node<T>) => boolean
) => {
  const connectedNodes: Node<T>[] =
    direction === 'in' ? getIncomers(node, items) : getOutgoers(node, items);

  if (!connectedNodes.length) {
    return;
  }

  for (const connectedNode of connectedNodes) {
    if (callback(connectedNode)) {
      return;
    }

    travelNodes(connectedNode, items, direction, callback);
  }
};
