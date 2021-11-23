import { ConditionalRuleType } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { DateConditionalRuleDto } from '../inputs/conditionalRules/DateConditionalRuleDto';
import { HtmlConditionalRuleDto } from '../inputs/conditionalRules/HtmlConditionalRuleDto';
import { VariableConditionalRuleDto } from '../inputs/conditionalRules/VariableConditionalRuleDto';

export const conditionalRules = (supportedTypes: ConditionalRuleType[]) => {
  return jf.any().custom(({ joi }) => {
    const ruleSchema = joi
      .object()
      .schema({
        ruleType: joi.string().valid(...supportedTypes),
      })
      .when('ruleType', {
        switch: [
          {
            is: ConditionalRuleType.HtmlElement,
            then: HtmlConditionalRuleDto.toJoi(),
          },
          {
            is: ConditionalRuleType.Date,
            then: DateConditionalRuleDto.toJoi(),
          },
          {
            is: ConditionalRuleType.Variable,
            then: VariableConditionalRuleDto.toJoi(),
          },
        ],
      });

    return joi.array().items(DateConditionalRuleDto.toJoi());
  });
};
