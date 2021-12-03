import { useCallback, useState } from 'react';
import { useFormState } from 'react-final-form';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';

// TODO Check performance impact
export const useNodeIndex = (nodeId: string) => {
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);

  const getIndex = useCallback(() => {
    const items = getItems();

    return items.findIndex((item) => item.id === nodeId);
  }, [getItems, nodeId]);

  const [index, setIndex] = useState(getIndex());

  useFormState({
    subscription: {
      values: true,
    },
    onChange: () => setIndex(getIndex()),
  });

  return index;
};
