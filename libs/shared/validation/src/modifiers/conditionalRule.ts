import { ConditionalRuleType } from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { DateRuleSchema } from '../schema/conditionalRules/DateRule.schema';
import { HtmlConditionalRuleSchema } from '../schema/conditionalRules/HtmlConditionalRule.schema';
import { VariableConditionalRuleSchema } from '../schema/conditionalRules/VariableConditionalRule.schema';
import { JoiMessages } from '../types';

const typeSchemaMap = {
  [ConditionalRuleType.HtmlElement]: HtmlConditionalRuleSchema,
  [ConditionalRuleType.Date]: DateRuleSchema,
  [ConditionalRuleType.Variable]: VariableConditionalRuleSchema,
};

export const conditionalRules = (allowedTypes: ConditionalRuleType[]) => {
  const whenSchema = joi.object({
    ruleType: joi.string().allow(...allowedTypes),
  });

  const ruleSchema = allowedTypes.reduce(
    (currentSchema, allowedType) =>
      currentSchema.when(
        joi.object({
          ruleType: joi.string().valid(allowedType),
        }),
        {
          then: typeSchemaMap[allowedType],
        }
      ),
    joi.object()
  );

  const arrayItem = joi.object().when(whenSchema, {
    then: ruleSchema,
    otherwise: joi.custom((_, helpers) =>
      helpers.error(JoiMessages.InvalidConditionalRule)
    ),
  });

  return joi.array().items(arrayItem);
};
