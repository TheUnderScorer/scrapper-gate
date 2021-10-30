import { Node } from 'react-flow-renderer';
import {
  BaseNodeProperties,
  FlowBuilderItem,
  FlowBuilderProps,
} from '../FlowBuilder.types';
import { createNodeFromSelection } from './createNodeFromSelection';

export const basicHandleAddNode =
  <T extends BaseNodeProperties>(
    idGenerator: () => string,
    interceptor?: (node: Node<T>, items: FlowBuilderItem<T>[]) => Node<T>
  ): FlowBuilderProps<T>['onAdd'] =>
  (selection, { position, items }) => {
    if (!position) {
      throw new TypeError('Position is required.');
    }

    const node = createNodeFromSelection(
      selection.value?.id || idGenerator(),
      selection,
      position
    ) as Node<T>;

    const interceptedNode = interceptor ? interceptor(node, items) : node;

    return {
      createdNodes: [interceptedNode],
      items: [...items, interceptedNode],
    };
  };
