import { isNode, Node } from 'react-flow-renderer';
import { BaseNodeProperties, FlowBuilderItem } from '../FlowBuilder.types';

export const filterForNodes = <T extends BaseNodeProperties>(
  arr: FlowBuilderItem<T>[]
): Node<T>[] => {
  return arr.filter((item) => isNode(item)) as Node<T>[];
};

export const getFurthestNode =
  <T extends BaseNodeProperties>(nodes: Node<T>[]) =>
  (pos: 'x' | 'y') => {
    let largestPos = 0;
    let currentNode: Node<T>;

    nodes.forEach((node) => {
      if (node.position[pos] > largestPos) {
        largestPos = node.position[pos];
        currentNode = node;
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return currentNode!;
  };
