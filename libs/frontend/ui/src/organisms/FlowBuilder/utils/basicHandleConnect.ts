import { FlowBuilderProps } from '../FlowBuilder';
import { createEdge } from './createEdgeId';

export const basicHandleConnect = (): FlowBuilderProps['onConnect'] => (
  connection,
  edge
) => {
  return createEdge({
    edge,
    sourceId: connection.source,
    targetId: connection.target,
    data: {
      targetHandle: connection.targetHandle,
      sourceHandle: connection.sourceHandle,
    },
  });
};
