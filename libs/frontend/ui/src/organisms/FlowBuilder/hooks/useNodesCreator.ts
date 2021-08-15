import { useFormUndo } from '@scrapper-gate/frontend/form';
import { withPrefix } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import { useCallback } from 'react';
import { useDebounce } from 'react-use';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { useAddItem } from './useAddItem';
import { useConnectHandler } from './useConnectHandler';

export const useNodesCreator = () => {
  const connect = useConnectHandler();
  const addItem = useAddItem();

  const { reset } = useFormUndo();

  const nodesCreator = useFlowBuilderContextSelector((ctx) => ctx.nodesCreator);
  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);
  const setNodesRecreated = useFlowBuilderItemsSelector(
    (ctx) => ctx.setNodesRecreated
  );

  const handler = useCallback(() => {
    nodesCreator?.({
      handleConnect: (params, items) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        connect(params, { setItemsAfter: false, items })!,
      createNode: (selection) =>
        addItem(selection, {
          setItemsAfter: false,
        }),
    })
      .then((result) => {
        if (result?.length) {
          setItems(result);

          reset();
        }
      })
      .catch(logger.error);

    setNodesRecreated(true);
  }, [addItem, connect, nodesCreator, reset, setItems, setNodesRecreated]);

  // Every time "nodesCreator" is changed, trigger handler once again, because items inside it probably changed
  useDebounce(
    () => {
      logger.debug(withPrefix('Nodes creator changed', 'debounce'));

      handler();
    },
    250,
    [nodesCreator]
  );

  return handler;
};
