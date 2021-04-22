import { Edge } from 'react-flow-renderer';
import { BaseNodeProperties } from '../FlowBuilder.types';

interface CreateEdgeParams<T extends BaseNodeProperties> {
  sourceId: string;
  targetId: string;
  data?: T;
  edge?: Partial<Edge>;
}

export const createEdge = <T extends BaseNodeProperties>({
  sourceId,
  targetId,
  data,
  edge,
}: CreateEdgeParams<T>): Edge<T> => ({
  source: sourceId,
  target: targetId,
  id: `e${sourceId}-${targetId}`,
  ...edge,
  data: {
    ...edge?.data,
    ...data,
  },
});
