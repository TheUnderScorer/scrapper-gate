import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  ConditionalRuleCondition,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
  Variable,
  VariableConditionalRule,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { subSeconds } from 'date-fns';
import { resolveRules } from '../resolveRules';
import { makeVariableResolver } from './variableResolver';

describe('Variable resolver', () => {
  it.each<
    [
      rule: VariableConditionalRule,
      variables: Variable[],
      expectedResult: boolean
    ]
  >([
    [
      {
        condition: ConditionalRuleCondition.Equals,
        ruleType: ConditionalRuleType.Variable,
        expectedValue: 'Test',
        variableKey: 'test',
      },
      [
        createVariable({
          type: VariableType.Text,
          value: 'Test',
          scope: VariableScope.Global,
          key: 'test',
        }),
      ],
      true,
    ],
    [
      {
        condition: ConditionalRuleCondition.Equals,
        ruleType: ConditionalRuleType.Variable,
        expectedValue: 'Test',
        variableKey: 'test',
      },
      [
        createVariable({
          type: VariableType.Text,
          defaultValue: 'Test123',
          scope: VariableScope.Global,
          key: 'test',
        }),
      ],
      false,
    ],
    [
      {
        ruleType: ConditionalRuleType.Variable,
        condition: ConditionalRuleCondition.Includes,
        variableKey: 'test',
        expectedValue: 'Test',
      },
      [
        createVariable({
          type: VariableType.Text,
          value: 'Test123',
          scope: VariableScope.Global,
          key: 'test',
        }),
      ],
      true,
    ],
    [
      {
        ruleType: ConditionalRuleType.Variable,
        variableKey: 'test',
        condition: ConditionalRuleCondition.Equals,
        expectedValue: 'Test',
      },
      [
        createVariable({
          type: VariableType.Text,
          value: 'Test123',
          scope: VariableScope.Global,
          key: 'test123',
        }),
      ],
      false,
    ],
    [
      {
        ruleType: ConditionalRuleType.Variable,
        variableKey: 'test',
        condition: ConditionalRuleCondition.MoreThan,
        expectedValue: 45,
      },
      [
        createVariable({
          type: VariableType.Number,
          value: 50,
          scope: VariableScope.Global,
          key: 'test',
        }),
      ],
      true,
    ],
    [
      {
        ruleType: ConditionalRuleType.Variable,
        variableKey: 'test',
        condition: ConditionalRuleCondition.LessThan,
        expectedValue: '55',
      },
      [
        createVariable({
          type: VariableType.Number,
          value: 50,
          scope: VariableScope.Global,
          key: 'test',
        }),
      ],
      true,
    ],
    [
      {
        ruleType: ConditionalRuleType.Variable,
        variableKey: 'test',
        condition: ConditionalRuleCondition.LessThan,
        expectedValue: new Date(),
      },
      [
        createVariable({
          type: VariableType.Date,
          value: subSeconds(new Date(), 60),
          scope: VariableScope.Global,
          key: 'test',
        }),
      ],
      true,
    ],
  ])(
    'should return true if rule has passed',
    async (rule, variables, expectedResult) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleType.Variable]: makeVariableResolver(variables),
        },
        ruleGroups: [
          {
            matchType: ConditionalRuleGroupMatchType.Any,
            rules: [rule],
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    }
  );
});
