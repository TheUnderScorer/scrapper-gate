import { DataObject } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleTypes,
  HtmlElementRuleMeta,
} from '@scrapper-gate/shared/domain/conditional-rules';
import {
  ConditionalRule,
  ConditionalRuleGroup,
  ConditionalRuleGroupType,
  Selector,
} from '@scrapper-gate/shared/schema';

export class ConditionalRuleGroupModel
  extends DataObject<ConditionalRuleGroup>
  implements ConditionalRuleGroup
{
  id: string;

  rules: ConditionalRule[];

  type: ConditionalRuleGroupType;

  get selectors(): Selector[] {
    return this.rules.flatMap((rule) =>
      rule.type === ConditionalRuleTypes.HtmlElement
        ? (rule.meta as HtmlElementRuleMeta).selectors
        : []
    );
  }
}
