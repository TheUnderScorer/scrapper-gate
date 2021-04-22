import { useMemo } from 'react';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';

export const useIsRecentlyCreated = (nodeId: string) => {
  const recentlyCreatedNodeIds = useFlowBuilderItemsSelector(
    (ctx) => ctx.recentlyCreatedNodeIds
  );

  return useMemo(() => recentlyCreatedNodeIds?.includes(nodeId), [
    nodeId,
    recentlyCreatedNodeIds,
  ]);
};
