import { ConditionalRuleGroupType } from '@scrapper-gate/shared/schema';
import { v4 } from 'uuid';
import { resolveRules } from '../resolveRules';
import {
  BaseConditionalRuleWhen,
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
      when: BaseConditionalRuleWhen,
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
      BaseConditionalRuleWhen.NotEmpty,
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
      BaseConditionalRuleWhen.Empty,
      false,
    ],
    [[], BaseConditionalRuleWhen.Empty, true],
    [[], BaseConditionalRuleWhen.NotEmpty, false],
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
      when: BaseConditionalRuleWhen,
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
      BaseConditionalRuleWhen.Equals,
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
      BaseConditionalRuleWhen.NotEqual,
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
      BaseConditionalRuleWhen.LessThan,
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
      BaseConditionalRuleWhen.MoreThan,
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
      when: BaseConditionalRuleWhen,
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
      BaseConditionalRuleWhen.Equals,
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
      BaseConditionalRuleWhen.Equals,
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
      BaseConditionalRuleWhen.NotEqual,
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
