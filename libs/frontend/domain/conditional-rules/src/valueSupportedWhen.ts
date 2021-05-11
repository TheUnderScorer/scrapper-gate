import { BaseConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';

export const valueSupportedWhen = [
  BaseConditionalRuleWhen.Equal,
  BaseConditionalRuleWhen.LessThanOrEqual,
  BaseConditionalRuleWhen.MoreThan,
  BaseConditionalRuleWhen.MoreThanOrEqual,
  BaseConditionalRuleWhen.LessThan,
  BaseConditionalRuleWhen.Includes,
  BaseConditionalRuleWhen.NotIncludes,
];
