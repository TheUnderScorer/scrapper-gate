import {
  ConditionalRuleGroupInput,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { conditionalRules } from '../../modifiers/conditionalRule';
import { enumField } from '../../modifiers/enum';

export const ScrapperConditionalRuleGroupInputSchema =
  joi.object<ConditionalRuleGroupInput>({
    matchType: enumField(ConditionalRuleGroupMatchType),
    rules: conditionalRules([
      ConditionalRuleType.Variable,
      ConditionalRuleType.Date,
      ConditionalRuleType.HtmlElement,
    ]),
  });
