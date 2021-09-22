import { withPrefix } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import { useEffect } from 'react';
import { useDebounce } from 'react-use';
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

  // Every time "nodesCreator" is changed, trigger handler once again, because items inside it probably changed
  useDebounce(
    () => {
      logger.debug(withPrefix('Nodes creator changed', 'debounce'));

      nodesCreatorHandler();
    },
    250,
    [nodesCreator]
  );

  useEffect(() => {
    if (loading || !nodesCreator || nodesRecreated) {
      return;
    }

    nodesCreatorHandler();
  }, [loading, nodesCreator, nodesCreatorHandler, nodesRecreated]);
};
