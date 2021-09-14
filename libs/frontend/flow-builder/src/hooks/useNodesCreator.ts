import { useFormUndo } from '@scrapper-gate/frontend/form';
import { logger } from '@scrapper-gate/shared/logger/console';
import { useCallback } from 'react';
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

  return useCallback(() => {
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
};
