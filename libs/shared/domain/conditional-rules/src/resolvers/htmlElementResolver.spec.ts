import {
  ConditionalRuleCondition,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
  HtmlConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { resolveRules } from '../resolveRules';
import {
  htmlElementResolver,
  HtmlElementResolverElementDefinition,
} from './htmlElementResolver';

describe('Html element resolver', () => {
  it.each<
    [
      elements: HtmlElementResolverElementDefinition[],
      condition: ConditionalRuleCondition,
      expectedResult: boolean
    ]
  >([
    [
      [
        {
          attributes: {},
          tag: 'DIV',
          textContent: 'text content',
        },
      ],
      ConditionalRuleCondition.NotEmpty,
      true,
    ],
    [
      [
        {
          attributes: {},
          tag: 'DIV',
          textContent: '',
        },
      ],
      ConditionalRuleCondition.Empty,
      true,
    ],
    [[], ConditionalRuleCondition.Exists, false],
    [[], ConditionalRuleCondition.NotExists, true],
  ])(
    'should return correct result for html element',
    async (elements, condition, expectedResult) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleType.HtmlElement]: htmlElementResolver.make({
            elements,
          }),
        },
        ruleGroups: [
          {
            matchType: ConditionalRuleGroupMatchType.Any,
            rules: [
              {
                ruleType: ConditionalRuleType.HtmlElement,
                type: HtmlConditionalRuleType.Element,
                condition,
                matchType: ConditionalRuleGroupMatchType.All,
              },
            ],
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    }
  );

  it.each<
    [
      elements: HtmlElementResolverElementDefinition[],
      condition: ConditionalRuleCondition,
      attribute: string,
      expectedResult: boolean,
      expectedAttributeValue?: string
    ]
  >([
    [
      [
        {
          attributes: {
            'data-id': '#test',
          },
          tag: 'DIV',
          textContent: '',
        },
      ],
      ConditionalRuleCondition.Equals,
      'data-id',
      true,
      '#test',
    ],
    [
      [
        {
          attributes: {
            'data-id': '#test',
          },
          tag: 'DIV',
          textContent: '',
        },
      ],
      ConditionalRuleCondition.NotEqual,
      'data-id',
      false,
      '#test',
    ],
    [
      [
        {
          attributes: {
            'data-id': '1',
          },
          tag: 'DIV',
          textContent: '',
        },
      ],
      ConditionalRuleCondition.LessThan,
      'data-id',
      true,
      '2',
    ],
    [
      [
        {
          attributes: {
            'data-id': '1',
          },
          tag: 'DIV',
          textContent: '',
        },
      ],
      ConditionalRuleCondition.MoreThan,
      'data-id',
      false,
      '2',
    ],
  ])(
    'should return correct result for attribute',
    async (elements, condition, attribute, expectedResult, attributeValue) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleType.HtmlElement]: htmlElementResolver.make({
            elements,
          }),
        },
        ruleGroups: [
          {
            matchType: ConditionalRuleGroupMatchType.Any,
            rules: [
              {
                ruleType: ConditionalRuleType.HtmlElement,
                type: HtmlConditionalRuleType.Attribute,
                condition,
                attribute: {
                  attribute,
                  value: attributeValue,
                },
              },
            ],
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    }
  );

  it.each<
    [
      elements: HtmlElementResolverElementDefinition[],
      condition: ConditionalRuleCondition,
      expectedResult: boolean,
      expectedTagValue?: string
    ]
  >([
    [
      [
        {
          attributes: {
            'data-id': '#test',
          },
          tag: 'DIV',
          textContent: '',
        },
      ],
      ConditionalRuleCondition.Equals,
      true,
      'div',
    ],
    [
      [
        {
          attributes: {
            'data-id': '#test',
          },
          tag: 'DIV',
          textContent: '',
        },
      ],
      ConditionalRuleCondition.Equals,
      false,
      'span',
    ],
    [
      [
        {
          attributes: {
            'data-id': '#test',
          },
          tag: 'DIV',
          textContent: '',
        },
      ],
      ConditionalRuleCondition.NotEqual,
      true,
      'span',
    ],
  ])(
    'should return correct result for tag',
    async (elements, condition, expectedResult, expectedTag) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleType.HtmlElement]: htmlElementResolver.make({
            elements,
          }),
        },
        ruleGroups: [
          {
            matchType: ConditionalRuleGroupMatchType.Any,
            rules: [
              {
                ruleType: ConditionalRuleType.HtmlElement,
                type: HtmlConditionalRuleType.Tag,
                condition,
                tagName: expectedTag,
                matchType: ConditionalRuleGroupMatchType.All,
              },
            ],
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    }
  );
});
