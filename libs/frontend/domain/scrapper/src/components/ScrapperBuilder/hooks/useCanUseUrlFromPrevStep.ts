import { useMemo } from 'react';
import { useForm } from 'react-final-form';
import { isNode } from 'react-flow-renderer';
import { ScrapperBuilderFormState } from '../ScrapperBuilder.types';
import { canUseUrlFromPrevStep } from '../logic/canUseUrlFromPrevStep';

export const useCanUseUrlFromPrevStep = (
  nodeIndex: number,
  useFormHook: typeof useForm = useForm
) => {
  const { getState } = useFormHook();

  return useMemo(() => {
    const values = getState().values as ScrapperBuilderFormState;

    const node = values.items[nodeIndex];

    if (!node || !isNode(node)) {
      return false;
    }

    return canUseUrlFromPrevStep(
      node,
      values.items,
      values.runSettings?.initialUrl
    );
  }, [getState, nodeIndex]);
};
