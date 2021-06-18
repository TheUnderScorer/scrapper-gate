import { useFormUndo } from '@scrapper-gate/frontend/form';
import { logger } from '@scrapper-gate/frontend/logger';
import { useEffect } from 'react';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { useAddItem } from './useAddItem';
import { useConnectHandler } from './useConnectHandler';

export const useNodesCreator = () => {
  const connect = useConnectHandler();
  const addItem = useAddItem();

  const { reset } = useFormUndo();

  const loading = useFlowBuilderContextSelector((ctx) => ctx.loading);
  const nodesCreator = useFlowBuilderContextSelector((ctx) => ctx.nodesCreator);
  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);
  const [
    nodesRecreated,
    setNodesRecreated,
  ] = useFlowBuilderItemsSelector((ctx) => [
    ctx.nodesRecreated,
    ctx.setNodesRecreated,
  ]);

  useEffect(() => {
    if (loading || !nodesCreator || nodesRecreated) {
      return;
    }

    nodesCreator({
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
  }, [
    addItem,
    connect,
    loading,
    nodesCreator,
    reset,
    setItems,
    nodesRecreated,
    setNodesRecreated,
  ]);
};
