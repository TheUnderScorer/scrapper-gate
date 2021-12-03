import { HtmlConditionalRuleType, Maybe } from '@scrapper-gate/shared/schema';

export const getHtmlRuleValueName = (type?: Maybe<HtmlConditionalRuleType>) =>
  type === HtmlConditionalRuleType.Tag ? 'tagName' : 'attribute.value';
