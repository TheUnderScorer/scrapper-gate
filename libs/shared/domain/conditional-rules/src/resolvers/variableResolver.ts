import { primitiveValueResolver } from './primitiveValueResolver';
import { getVariableValue } from '@scrapper-gate/shared/domain/variables';
import { RuleResolver } from '../types';
import { Variable } from '@scrapper-gate/shared/schema';

export const makeVariableResolver =
  (variables: Variable[]): RuleResolver =>
  (rule) => {
    const variable = variables.find((variable) => variable.key === rule.what);

    if (!variable) {
      return false;
    }

    return primitiveValueResolver(rule, getVariableValue(variable));
  };
