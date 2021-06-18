import { Node } from 'react-flow-renderer';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { FlowBuilderProps } from '../FlowBuilder';
import { createNodeFromSelection } from './createNodeFromSelection';

export const basicHandleAddNode = <T extends BaseNodeProperties>(
  idGenerator: () => string,
  interceptor?: (node: Node<T>) => Node<T>
): FlowBuilderProps<T>['onAdd'] => (selection, { position, items }) => {
  if (!position) {
    throw new TypeError('Position is required.');
  }

  const node = createNodeFromSelection(
    selection.value?.id || idGenerator(),
    selection,
    position
  ) as Node<T>;

  const interceptedNode = interceptor ? interceptor(node) : node;

  return {
    createdNodes: [interceptedNode],
    items: [...items, interceptedNode],
  };
};
