import { useVariablesContext } from '@scrapper-gate/frontend/domain/variables';
import { flowBuilderUtils } from '@scrapper-gate/frontend/flow-builder';
import { scrapperActionHasValue } from '@scrapper-gate/shared/domain/scrapper';
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
import { ScrapperBuilderFormState } from '../ScrapperBuilder.types';

// TODO Z-index issues (ex. my portfolio site)
// TODO In URL field select "Stay on page from previous step" automatically if previous step url is the same
// TODO Validate if "Stay on page from previous step" can be selected (ex. it shouldn't be in first step)
// TODO When field has a variable from previous step, and is visited from run view the variable is resolved, and it shouldn't be!
export const useScrapperStepVariables = (nodeIndex: number) => {
  const { variables } = useVariablesContext();

  const { getState } = useForm();

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
          scrapperActionHasValue(node.data.action)
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

    return allVariables;
  }, [getState, nodeIndex, variables]);
};
