import {
  ConditionalRuleCondition,
  ConditionalRuleType,
  HtmlConditionalRuleType,
  Variable,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { omit, pick } from 'remeda';
import { ConditionalRulesMap } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupportedConditionsCallback<
  Type extends ConditionalRuleType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Ctx = any
> = (
  rule: ConditionalRulesMap[Type],
  ctx: Ctx
) => Record<string, ConditionalRuleCondition> | undefined;

export interface ConditionalRuleDefinition<
  Type extends ConditionalRuleType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Ctx = any
> {
  type: Type;
  description: string;
  supportedConditions?:
    | Record<string, ConditionalRuleCondition>
    | SupportedConditionsCallback<Type, Ctx>;
  valueSupportedConditions?: ConditionalRuleCondition[];
}

export type ConditionalRuleDefinitions = {
  [Key in ConditionalRuleType]: ConditionalRuleDefinition<Key>;
};

export const NumericConditionalRuleCondition = pick(ConditionalRuleCondition, [
  ConditionalRuleCondition.LessThan,
  ConditionalRuleCondition.MoreThan,
  ConditionalRuleCondition.Equals,
  ConditionalRuleCondition.NotEqual,
  ConditionalRuleCondition.LessThanOrEqual,
  ConditionalRuleCondition.MoreThanOrEqual,
]);

export const TextConditionalRuleCondition = pick(ConditionalRuleCondition, [
  ConditionalRuleCondition.Exists,
  ConditionalRuleCondition.NotExists,
  ConditionalRuleCondition.Empty,
  ConditionalRuleCondition.NotEmpty,
  ConditionalRuleCondition.Includes,
  ConditionalRuleCondition.NotIncludes,
  ConditionalRuleCondition.Equals,
  ConditionalRuleCondition.NotEqual,
]);

const defaultValueSupportedCondition = [
  ConditionalRuleCondition.Equals,
  ConditionalRuleCondition.NotEqual,
  ConditionalRuleCondition.LessThanOrEqual,
  ConditionalRuleCondition.MoreThan,
  ConditionalRuleCondition.MoreThanOrEqual,
  ConditionalRuleCondition.LessThan,
  ConditionalRuleCondition.Includes,
  ConditionalRuleCondition.NotIncludes,
];

export const conditionalRuleDefinitions: ConditionalRuleDefinitions = {
  [ConditionalRuleType.Date]: {
    type: ConditionalRuleType.Date,
    description: 'Check condition using provided date.',
    supportedConditions: NumericConditionalRuleCondition,
    valueSupportedConditions: defaultValueSupportedCondition,
  },
  [ConditionalRuleType.HtmlElement]: {
    type: ConditionalRuleType.HtmlElement,
    description:
      "Check html element using it's attributes, tag name, or if it simply exists in DOM.",
    valueSupportedConditions: defaultValueSupportedCondition,
    supportedConditions: (rule) => {
      switch (rule.type) {
        case HtmlConditionalRuleType.Element:
          return omit(TextConditionalRuleCondition, [
            ConditionalRuleCondition.Equals,
            ConditionalRuleCondition.NotEqual,
          ]);

        case HtmlConditionalRuleType.Tag:
          return omit(TextConditionalRuleCondition, [
            ConditionalRuleCondition.Empty,
            ConditionalRuleCondition.NotEmpty,
            ConditionalRuleCondition.Exists,
            ConditionalRuleCondition.NotExists,
          ]);

        default:
          return ConditionalRuleCondition;
      }
    },
  },
  [ConditionalRuleType.Variable]: {
    type: ConditionalRuleType.Variable,
    description: 'Check condition using selected variable.',
    valueSupportedConditions: defaultValueSupportedCondition,
    supportedConditions: (rule, ctx: { variables?: Variable[] }) => {
      const variable = ctx.variables?.find((v) => v.key === rule.variableKey);

      if (!variable) {
        return {};
      }

      switch (variable.type) {
        case VariableType.Date:
        case VariableType.Number:
          return NumericConditionalRuleCondition;

        default:
          return omit(TextConditionalRuleCondition, [
            ConditionalRuleCondition.Exists,
            ConditionalRuleCondition.NotExists,
          ]);
      }
    },
  },
};
