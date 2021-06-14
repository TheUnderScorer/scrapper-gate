import { ConditionalRule } from '@scrapper-gate/shared/schema';
import { ConditionalRuleWhen } from '../types';

export const primitiveValueResolver = (
  rule: ConditionalRule,
  value: unknown
) => {
  const actualValue = value?.valueOf();

  switch (rule.when) {
    case ConditionalRuleWhen.NotEqual:
      return actualValue?.toString() !== rule.value?.toString();

    case ConditionalRuleWhen.Equals:
      return actualValue?.toString() === rule.value?.toString();

    case ConditionalRuleWhen.Includes:
      return actualValue?.toString()?.includes(rule.value?.toString());

    case ConditionalRuleWhen.NotIncludes:
      return !actualValue?.toString()?.includes(rule.value?.toString());

    case ConditionalRuleWhen.LessThan:
      return Number(actualValue) < Number(rule.value);

    case ConditionalRuleWhen.LessThanOrEqual:
      return Number(actualValue) <= Number(rule.value);

    case ConditionalRuleWhen.MoreThan:
      return Number(actualValue) > Number(rule.value);

    case ConditionalRuleWhen.MoreThanOrEqual:
      return Number(actualValue) >= Number(rule.value);

    case ConditionalRuleWhen.Empty:
    case ConditionalRuleWhen.NotExists:
      return !actualValue;

    case ConditionalRuleWhen.NotEmpty:
    case ConditionalRuleWhen.Exists:
      return Boolean(actualValue);

    default:
      return false;
  }
};
