import { ConditionalRule } from '@scrapper-gate/shared/schema';
import { BaseConditionalRuleWhen } from '../types';

export const primitiveValueResolver = (
  rule: ConditionalRule,
  value: unknown
) => {
  const actualValue = value?.valueOf();

  switch (rule.when) {
    case BaseConditionalRuleWhen.NotEqual:
      return actualValue?.toString() !== rule.value?.toString();

    case BaseConditionalRuleWhen.Equals:
      return actualValue?.toString() === rule.value?.toString();

    case BaseConditionalRuleWhen.Includes:
      return actualValue?.toString()?.includes(rule.value?.toString());

    case BaseConditionalRuleWhen.NotIncludes:
      return !actualValue?.toString()?.includes(rule.value?.toString());

    case BaseConditionalRuleWhen.LessThan:
      return Number(actualValue) < Number(rule.value);

    case BaseConditionalRuleWhen.LessThanOrEqual:
      return Number(actualValue) <= Number(rule.value);

    case BaseConditionalRuleWhen.MoreThan:
      return Number(actualValue) > Number(rule.value);

    case BaseConditionalRuleWhen.MoreThanOrEqual:
      return Number(actualValue) >= Number(rule.value);

    case BaseConditionalRuleWhen.Empty:
    case BaseConditionalRuleWhen.NotExists:
      return !actualValue;

    case BaseConditionalRuleWhen.NotEmpty:
    case BaseConditionalRuleWhen.Exists:
      return Boolean(actualValue);

    default:
      return false;
  }
};
