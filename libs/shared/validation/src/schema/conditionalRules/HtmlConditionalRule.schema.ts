import {
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
  HtmlConditionalRule,
  HtmlConditionalRuleAttribute,
  HtmlConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { enumField } from '../../modifiers/enum';
import { SelectorSchema } from '../Selector.schema';
import { getBaseConditionalRuleMap } from './baseConditionalRuleMap';

const base = getBaseConditionalRuleMap(ConditionalRuleType.HtmlElement);

export const HtmlConditionalRuleSchema = joi
  .object<HtmlConditionalRule>({
    ...base,
    type: enumField(HtmlConditionalRuleType).required(),
    matchType: enumField(ConditionalRuleGroupMatchType).allow(null),
    selectors: joi.array().items(SelectorSchema),
    tagName: joi.string().allow(null).when('type', {
      is: HtmlConditionalRuleType.Tag,
      then: joi.string().required(),
    }),
    expectedTextContent: joi.string().allow(null),
    attribute: joi.object().when('type', {
      is: HtmlConditionalRuleType.Attribute,
      then: joi
        .object<HtmlConditionalRuleAttribute>({
          value: joi.string().allow(null),
          attribute: joi.string().required(),
        })
        .default({}),
      otherwise: joi.object().allow(null),
    }),
  })
  .when(
    joi.object({
      selectors: joi.object().min(1),
    }),
    {
      then: joi.object({
        matchType: enumField(ConditionalRuleGroupMatchType).required(),
      }),
    }
  );
