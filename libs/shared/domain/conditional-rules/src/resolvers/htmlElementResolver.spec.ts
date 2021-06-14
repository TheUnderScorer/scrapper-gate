import { ConditionalRuleGroupType } from '@scrapper-gate/shared/schema';
import { v4 } from 'uuid';
import { resolveRules } from '../resolveRules';
import {
  ConditionalRuleWhen,
  ConditionalRuleTypes,
  HtmlElementRuleMeta,
  HtmlElementWhat,
} from '../types';
import {
  HtmlElementResolverElementDefinition,
  makeHtmlElementResolver,
} from './htmlElementResolver';

describe('Html element resolver', () => {
  it.each<
    [
      elements: HtmlElementResolverElementDefinition[],
      when: ConditionalRuleWhen,
      expectedResult: boolean
    ]
  >([
    [
      [
        {
          attributes: {},
          tag: 'DIV',
          textContent: '',
        },
      ],
      ConditionalRuleWhen.NotEmpty,
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
      ConditionalRuleWhen.Empty,
      false,
    ],
    [[], ConditionalRuleWhen.Empty, true],
    [[], ConditionalRuleWhen.NotEmpty, false],
  ])(
    'should return correct result without "what"',
    async (elements, when, expectedResult) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleTypes.HtmlElement]: makeHtmlElementResolver({
            elements,
          }),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.Any,
            rules: [
              {
                id: v4(),
                type: ConditionalRuleTypes.HtmlElement,
                when,
                meta: {
                  type: ConditionalRuleGroupType.All,
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
      when: ConditionalRuleWhen,
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
      ConditionalRuleWhen.Equals,
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
      ConditionalRuleWhen.NotEqual,
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
      ConditionalRuleWhen.LessThan,
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
      ConditionalRuleWhen.MoreThan,
      'data-id',
      false,
      '2',
    ],
  ])(
    'should return correct result for attribute',
    async (elements, when, attribute, expectedResult, attributeValue) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleTypes.HtmlElement]: makeHtmlElementResolver({
            elements,
          }),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.Any,
            rules: [
              {
                id: v4(),
                type: ConditionalRuleTypes.HtmlElement,
                what: HtmlElementWhat.Attribute,
                when,
                value: attributeValue,
                meta: {
                  type: ConditionalRuleGroupType.All,
                  attribute,
                } as HtmlElementRuleMeta,
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
      when: ConditionalRuleWhen,
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
      ConditionalRuleWhen.Equals,
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
      ConditionalRuleWhen.Equals,
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
      ConditionalRuleWhen.NotEqual,
      true,
      'span',
    ],
  ])(
    'should return correct result for tag',
    async (elements, when, expectedResult, expectedTag) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleTypes.HtmlElement]: makeHtmlElementResolver({
            elements,
          }),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.Any,
            rules: [
              {
                id: v4(),
                type: ConditionalRuleTypes.HtmlElement,
                what: HtmlElementWhat.Tag,
                when,
                value: expectedTag,
                meta: {
                  type: ConditionalRuleGroupType.All,
                } as HtmlElementRuleMeta,
              },
            ],
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    }
  );
});
