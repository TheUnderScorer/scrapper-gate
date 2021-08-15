import { useEffect } from 'react';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { useNodesCreator } from './useNodesCreator';

export const useNodesCreatorHandler = () => {
  const nodesCreatorHandler = useNodesCreator();

  const loading = useFlowBuilderContextSelector((ctx) => ctx.loading);
  const nodesCreator = useFlowBuilderContextSelector((ctx) => ctx.nodesCreator);
  const nodesRecreated = useFlowBuilderItemsSelector(
    (ctx) => ctx.nodesRecreated
  );

  useEffect(() => {
    if (loading || !nodesCreator || nodesRecreated) {
      return;
    }

    nodesCreatorHandler();
  }, [loading, nodesCreator, nodesCreatorHandler, nodesRecreated]);
};
