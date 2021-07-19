import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  ConditionalRule,
  ConditionalRuleGroupType,
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { v4 } from 'uuid';
import { resolveRules } from '../resolveRules';
import { ConditionalRuleTypes, ConditionalRuleWhen } from '../types';
import { makeVariableResolver } from './variableResolver';

describe('Variable resolver', () => {
  it.each<
    [rule: ConditionalRule, variables: Variable[], expectedResult: boolean]
  >([
    [
      {
        id: v4(),
        type: ConditionalRuleTypes.Variable,
        when: ConditionalRuleWhen.Equals,
        value: 'Test',
        what: 'test',
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
        id: v4(),
        type: ConditionalRuleTypes.Variable,
        when: ConditionalRuleWhen.Equals,
        value: 'Test',
        what: 'test',
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
        id: v4(),
        type: ConditionalRuleTypes.Variable,
        when: ConditionalRuleWhen.Includes,
        value: 'Test',
        what: 'test',
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
        id: v4(),
        type: ConditionalRuleTypes.Variable,
        when: ConditionalRuleWhen.Equals,
        value: 'Test',
        what: 'test',
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
  ])(
    'should return true if rule has passed',
    async (rule, variables, expectedResult) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleTypes.Variable]: makeVariableResolver(variables),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.Any,
            rules: [rule],
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    }
  );
});
