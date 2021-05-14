import { useConnectHandler } from './useConnectHandler';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { useEffect, useState } from 'react';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { useAddItem } from './useAddItem';
import { logger } from '@scrapper-gate/frontend/logger';
import { useFormUndo } from '@scrapper-gate/frontend/form';

export const useNodesCreator = () => {
  const [done, setDone] = useState(false);
  const connect = useConnectHandler();
  const addItem = useAddItem();

  const { reset } = useFormUndo();

  const loading = useFlowBuilderContextSelector((ctx) => ctx.loading);
  const nodesCreator = useFlowBuilderContextSelector((ctx) => ctx.nodesCreator);
  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);

  useEffect(() => {
    if (loading || done || !nodesCreator) {
      return;
    }

    nodesCreator({
      handleConnect: (params, items) =>
        connect(params, { setItemsAfter: false, items }),
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

    setDone(true);
  }, [addItem, connect, done, loading, nodesCreator, reset, setItems]);
};
