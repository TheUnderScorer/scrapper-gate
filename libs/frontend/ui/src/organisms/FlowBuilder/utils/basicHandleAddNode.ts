import { Node } from 'react-flow-renderer';
import {
  BaseNodeProperties,
  BaseNodeSelectionProperties,
} from '../FlowBuilder.types';
import { FlowBuilderProps } from '../FlowBuilder';
import { createNodeFromSelection } from './createNodeFromSelection';

export const basicHandleAddNode = <T extends BaseNodeProperties>(
  idGenerator: () => string,
  interceptor?: (node: Node<T>) => Node<T>
): FlowBuilderProps<T, BaseNodeSelectionProperties>['onAdd'] => (
  selection,
  { position, items }
) => {
  const node = createNodeFromSelection(
    idGenerator(),
    selection,
    position
  ) as Node<T>;

  const interceptedNode = interceptor ? interceptor(node) : node;

  return {
    createdNodes: [interceptedNode],
    items: [...items, interceptedNode],
  };
};
