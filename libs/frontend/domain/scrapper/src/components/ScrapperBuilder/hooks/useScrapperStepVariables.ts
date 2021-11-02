import { useVariablesContext } from '@scrapper-gate/frontend/domain/variables';
import { flowBuilderUtils } from '@scrapper-gate/frontend/flow-builder';
import { scrapperActionHasTextValue } from '@scrapper-gate/shared/domain/scrapper';
import {
  containsVariableKey,
  createVariable,
} from '@scrapper-gate/shared/domain/variables';
import {
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { useMemo } from 'react';
import { useForm } from 'react-final-form';
import { isNode } from 'react-flow-renderer';
import { uniqBy } from 'remeda';
import { ScrapperBuilderFormState } from '../ScrapperBuilder.types';

export const useScrapperStepVariables = (
  nodeIndex: number,
  useFormHook: typeof useForm = useForm
) => {
  const { variables } = useVariablesContext();

  const { getState } = useFormHook();

  return useMemo(() => {
    const values = getState().values as ScrapperBuilderFormState;

    const node = values.items[nodeIndex];

    if (!node || !isNode(node)) {
      return variables;
    }

    const allVariables: Variable[] = [...variables];

    flowBuilderUtils.travelNodes({
      node,
      items: values.items,
      direction: 'in',
      callback: (node) => {
        if (
          node.data?.key &&
          !containsVariableKey(node.data.key) &&
          node.data.action &&
          scrapperActionHasTextValue(node.data.action)
        ) {
          allVariables.push(
            createVariable({
              key: node.data.key,
              scope: VariableScope.Scrapper,
              type: node.data.valueType ?? VariableType.Text,
            })
          );
        }

        return false;
      },
    });

    return uniqBy(allVariables, (variable) => variable.key);
  }, [getState, nodeIndex, variables]);
};
