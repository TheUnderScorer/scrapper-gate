import {
  conditionalRuleDefinitions,
  ruleSupportsValue,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { parseVariableValue } from '@scrapper-gate/shared/domain/variables';
import {
  ConditionalRuleType,
  Variable,
  VariableConditionalRule,
} from '@scrapper-gate/shared/schema';
import { FieldsHandler } from '../../FieldsHandler';
import { blockEditorHandler } from '../blockEditorHandler';
import { selectHandler } from '../selectHandler';
import { createConditionalRuleFieldHandler } from './createConditionalRuleFieldHandler';

export const variableRuleHandler = (
  variables: Variable[],
  rule: VariableConditionalRule
) => {
  const variable = variables.find((v) => v.key === rule.variableKey);
  const ruleDefinition =
    conditionalRuleDefinitions[rule.ruleType as ConditionalRuleType.Variable];

  if (!variable) {
    throw new TypeError(`Variable with key ${rule.variableKey} not found`);
  }

  return createConditionalRuleFieldHandler<VariableConditionalRule>({
    createFieldsHandler: (fieldNameCreator, page, rule) => {
      const fields = {
        [fieldNameCreator('variableKey')]: {
          handler: selectHandler(rule.variableKey),
        },
        [fieldNameCreator('condition')]: {
          handler: selectHandler(rule.condition),
        },
      };

      const supportsValue = ruleSupportsValue(ruleDefinition, rule.condition);

      if (supportsValue) {
        fields[fieldNameCreator('expectedValue')] = {
          handler: blockEditorHandler(rule.expectedValue),
        };
      }

      return new FieldsHandler(fields, page);
    },
    getInputValue: async (fieldsHandler, fieldNameCreator) => {
      const condition = await fieldsHandler.getValue(
        fieldNameCreator('condition')
      );

      const supportsValue = ruleSupportsValue(ruleDefinition, condition);

      const ruleResult: VariableConditionalRule = {
        ruleType: ConditionalRuleType.Variable,
        variableKey: await fieldsHandler.getValue(
          fieldNameCreator('variableKey')
        ),
        condition: condition,
      };

      if (supportsValue) {
        ruleResult.expectedValue = parseVariableValue(
          await fieldsHandler.getValue(fieldNameCreator('expectedValue')),
          variable.type
        );
      }

      return ruleResult;
    },
  })(rule);
};
