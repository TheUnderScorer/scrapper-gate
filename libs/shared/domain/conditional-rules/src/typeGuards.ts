import {
  ConditionalRuleType,
  HtmlConditionalRule,
} from '@scrapper-gate/shared/schema';

export const isHtmlConditionalRule = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rule: any
): rule is HtmlConditionalRule => {
  return Boolean(
    typeof rule === 'object' &&
      'type' in rule &&
      rule.type === ConditionalRuleType.HtmlElement
  );
};
