import { ConditionalRuleGroupType } from '@scrapper-gate/shared/schema';
import { v4 } from 'uuid';
import { resolveRules, ResolveRulesParams } from './resolveRules';

describe('Resolve rules', () => {
  it.each<[params: ResolveRulesParams, expectedResult: boolean]>([
    [
      {
        resolvers: {
          testTrue: jest.fn(() => true),
          testFalse: jest.fn(() => false),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.All,
            rules: [
              {
                id: v4(),
                type: 'testTrue',
              },
              {
                id: v4(),
                type: 'testFalse',
              },
            ],
          },
        ],
      },
      false,
    ],
    [
      {
        resolvers: {
          testTrue: jest.fn(() => true),
          testFalse: jest.fn(() => false),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.Any,
            rules: [
              {
                id: v4(),
                type: 'testTrue',
              },
              {
                id: v4(),
                type: 'testFalse',
              },
            ],
          },
        ],
      },
      true,
    ],
    [
      {
        resolvers: {
          testTrue: jest.fn(() => true),
          testFalse: jest.fn(() => false),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.Any,
            rules: [
              {
                id: v4(),
                type: 'testTrue',
              },
              {
                id: v4(),
                type: 'testFalse',
              },
            ],
          },
          {
            id: v4(),
            type: ConditionalRuleGroupType.Any,
            rules: [
              {
                id: v4(),
                type: 'testTrue',
              },
            ],
          },
        ],
      },
      true,
    ],
    [
      {
        resolvers: {
          testTrue: jest.fn(() => true),
          testFalse: jest.fn(() => false),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.All,
            rules: [
              {
                id: v4(),
                type: 'testTrue',
              },
              {
                id: v4(),
                type: 'testTrue',
              },
            ],
          },
        ],
      },
      true,
    ],
    [
      {
        resolvers: {
          testTrue: jest.fn(() => true),
          testFalse: jest.fn(() => false),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.All,
            rules: [
              {
                id: v4(),
                type: 'testTrue',
              },
              {
                id: v4(),
                type: 'testTrue',
              },
            ],
          },
          {
            id: v4(),
            type: ConditionalRuleGroupType.All,
            rules: [
              {
                id: v4(),
                type: 'testTrue',
              },
            ],
          },
        ],
      },
      true,
    ],
    [
      {
        resolvers: {
          testTrue: jest.fn(() => true),
          testFalse: jest.fn(() => false),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.All,
            rules: [
              {
                id: v4(),
                type: 'testFalse',
              },
            ],
          },
          {
            id: v4(),
            type: ConditionalRuleGroupType.All,
            rules: [
              {
                id: v4(),
                type: 'testTrue',
              },
            ],
          },
        ],
      },
      true,
    ],
    [
      {
        resolvers: {
          testTrue: jest.fn(() => true),
          testFalse: jest.fn(() => false),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.All,
            rules: [
              {
                id: v4(),
                type: 'testFalse',
              },
            ],
          },
          {
            id: v4(),
            type: ConditionalRuleGroupType.All,
            rules: [
              {
                id: v4(),
                type: 'testFalse',
              },
            ],
          },
        ],
      },
      false,
    ],
  ])('should return correct result', async (params, expectedResult) => {
    const { result } = await resolveRules(params);

    expect(result).toEqual(expectedResult);
  });
});
