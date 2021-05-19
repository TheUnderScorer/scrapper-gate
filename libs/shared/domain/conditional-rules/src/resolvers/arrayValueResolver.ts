import { BaseConditionalRuleWhen } from '../types';
import {
  ConditionalRule,
  ConditionalRuleGroupType,
} from '@scrapper-gate/shared/schema';
import { primitiveValueResolver } from './primitiveValueResolver';

export const arrayValueResolver = (
  rule: ConditionalRule,
  value: unknown[] = [],
  type: ConditionalRuleGroupType = ConditionalRuleGroupType.All
) => {
  const matchFn =
    type === ConditionalRuleGroupType.All
      ? value?.every.bind(value)
      : value?.some.bind(value);

  switch (rule.when) {
    case BaseConditionalRuleWhen.Empty:
    case BaseConditionalRuleWhen.NotExists:
      return !value.length || matchFn?.((value) => !value);

    case BaseConditionalRuleWhen.NotEmpty:
    case BaseConditionalRuleWhen.Exists:
      return value.length > 0 && matchFn?.(Boolean);

    default:
      return (
        value.length > 0 &&
        matchFn?.((value) => primitiveValueResolver(rule, value))
      );
  }
};
