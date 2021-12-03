import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  ConditionalRuleCondition,
  ConditionalRuleType,
  VariableConditionalRule,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { JoiMessages } from '../../types';
import { validationMessages } from '../../validationMessages';
import { VariableConditionalRuleSchema } from './VariableConditionalRule.schema';

const variables = [
  createVariable({
    value: 'test',
    key: 'testText',
    type: VariableType.Text,
    scope: VariableScope.Global,
  }),
];

describe('Variable conditional rule', () => {
  it.each<[rule: VariableConditionalRule, expectedError?: string]>([
    [
      {
        expectedValue: 'test',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        variableKey: variables[0].key!.toString(),
        condition: ConditionalRuleCondition.Equals,
        ruleType: ConditionalRuleType.Variable,
      },
      undefined,
    ],
    [
      {
        expectedValue: 12345,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        variableKey: variables[0].key!.toString(),
        condition: ConditionalRuleCondition.Equals,
        ruleType: ConditionalRuleType.Variable,
      },
      validationMessages[JoiMessages.String],
    ],
  ])('should validate variable value', (rule, expectedMessage) => {
    const result = VariableConditionalRuleSchema.validate(rule, {
      context: {
        variables,
      },
      messages: validationMessages,
    });

    if (expectedMessage) {
      expect(result.error?.message).toEqual(expectedMessage);
    } else {
      expect(result.error).toBeFalsy();
    }
  });
});
