/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FlowBuilderProps } from '../FlowBuilder';
import { createEdge } from './createEdge';

export const basicHandleConnect = (): FlowBuilderProps['onConnect'] => (
  connection,
  edge
) => {
  return createEdge({
    edge,
    sourceId: connection.source!,
    targetId: connection.target!,
    data: {
      targetHandle: connection.targetHandle!,
      sourceHandle: connection.sourceHandle!,
    },
  });
};
