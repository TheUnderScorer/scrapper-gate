import { primitiveValueResolver } from './primitiveValueResolver';
import { getVariableValue } from '@scrapper-gate/shared/domain/variables';
import { RuleResolver } from '../types';
import { ConditionalRuleType, Variable } from '@scrapper-gate/shared/schema';

export const makeVariableResolver =
  (variables: Variable[]): RuleResolver<ConditionalRuleType.Variable> =>
  (rule) => {
    const variable = variables.find(
      (variable) => variable.key === rule.variableKey
    );

    if (!variable) {
      return false;
    }

    return primitiveValueResolver({
      expectedValue: rule.expectedValue,
      value: getVariableValue({ variable, raw: true }),
      condition: rule.condition,
    });
  };
