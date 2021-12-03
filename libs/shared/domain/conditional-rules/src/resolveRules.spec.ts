import {
  ConditionalRuleCondition,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { resolveRules, ResolveRulesParams } from './resolveRules';

describe('Resolve rules', () => {
  const stubRules = [
    {
      ruleType: ConditionalRuleType.Date,
      expectedDate: new Date(),
      condition: ConditionalRuleCondition.Equals,
    },
  ];

  it.each<[params: ResolveRulesParams, expectedResult: boolean]>([
    // Case: match type set to "all, first rule returns true
    [
      {
        resolvers: {
          Date: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
        },
        ruleGroups: [
          {
            matchType: ConditionalRuleGroupMatchType.All,
            rules: stubRules,
          },
          {
            matchType: ConditionalRuleGroupMatchType.All,
            rules: stubRules,
          },
        ],
      },
      true,
    ],
    // Case: match type set to "all, first rule returns false, second true
    [
      {
        resolvers: {
          Date: jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true),
        },
        ruleGroups: [
          {
            matchType: ConditionalRuleGroupMatchType.All,
            rules: [...stubRules, ...stubRules],
          },
        ],
      },
      false,
    ],
    // Case: match type set to "any", second rule returns true
    [
      {
        resolvers: {
          Date: jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true),
        },
        ruleGroups: [
          {
            matchType: ConditionalRuleGroupMatchType.Any,
            rules: stubRules,
          },
          {
            matchType: ConditionalRuleGroupMatchType.All,
            rules: stubRules,
          },
        ],
      },
      true,
    ],
  ])('should return correct result', async (params, expectedResult) => {
    const { result } = await resolveRules(params);

    expect(result).toEqual(expectedResult);
  });
});
