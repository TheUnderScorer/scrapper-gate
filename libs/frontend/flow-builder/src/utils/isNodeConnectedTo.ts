import { isNode, Node } from 'react-flow-renderer';
import { BaseNodeProperties, FlowBuilderItem } from '../FlowBuilder.types';
import { travelNodes } from './travelNodes';

export const isNodeConnectedTo = (
  nodeId: string,
  targetNodeId: string,
  items: FlowBuilderItem<BaseNodeProperties>[]
) => {
  let result = false;

  const node = items.find((item) => isNode(item) && item.id === nodeId) as Node;

  if (!node) {
    return result;
  }

  const travelNodeCallback = (visitedNode: Node) => {
    if (visitedNode.id === targetNodeId) {
      result = true;
    }

    return result;
  };

  travelNodes({
    node: node,
    items: items,
    direction: 'in',
    callback: travelNodeCallback,
  });

  if (result) {
    return result;
  }

  travelNodes({
    node: node,
    items: items,
    direction: 'out',
    callback: travelNodeCallback,
  });

  return result;
};
