import { Edge } from 'react-flow-renderer';
import { BaseNodeProperties } from '../FlowBuilder.types';

interface CreateEdgeParams<T extends BaseNodeProperties> {
  sourceId: string;
  targetId: string;
  data?: T;
  edge?: Partial<Edge>;
}

export const generateEdgeId = (sourceId: string, targetId: string) =>
  `e${sourceId}-${targetId}`;

export const createEdge = <T extends BaseNodeProperties>({
  sourceId,
  targetId,
  data,
  edge,
}: CreateEdgeParams<T>): Edge<T> => ({
  source: sourceId,
  target: targetId,
  id: generateEdgeId(sourceId, targetId),
  ...edge,
  data: {
    ...edge?.data,
    ...data,
  },
});
