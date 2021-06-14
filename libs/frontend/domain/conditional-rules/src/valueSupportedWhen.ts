import { ConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';

export const valueSupportedWhen = [
  ConditionalRuleWhen.Equals,
  ConditionalRuleWhen.NotEqual,
  ConditionalRuleWhen.LessThanOrEqual,
  ConditionalRuleWhen.MoreThan,
  ConditionalRuleWhen.MoreThanOrEqual,
  ConditionalRuleWhen.LessThan,
  ConditionalRuleWhen.Includes,
  ConditionalRuleWhen.NotIncludes,
];
