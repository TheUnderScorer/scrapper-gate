import { getById } from '@scrapper-gate/shared/common';
import { Node } from 'react-flow-renderer';
import { BaseNodeProperties, FlowBuilderItem } from '../FlowBuilder.types';
import { getNodeEdges } from './getNodeEdges';

export const getPrevNode = <T extends BaseNodeProperties>(
  items: FlowBuilderItem<T>[],
  nodeId: string
): Node<T> | undefined => {
  const edges = getNodeEdges(items, nodeId);
  const targetEdge = edges.find((edge) => edge.target === nodeId);

  return targetEdge
    ? (getById(items, targetEdge.source) as Node<T>)
    : undefined;
};
