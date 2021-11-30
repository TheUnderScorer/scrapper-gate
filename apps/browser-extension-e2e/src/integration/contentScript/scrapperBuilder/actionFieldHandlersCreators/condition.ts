import { getHtmlRuleValueName } from '@scrapper-gate/frontend/domain/conditional-rules';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { DateFormat } from '@scrapper-gate/shared/common';
import {
  conditionalRuleDefinitions,
  ruleSupportsValue,
  SupportedConditionsCallback,
} from '@scrapper-gate/shared/domain/conditional-rules';
import {
  ConditionalRuleCondition,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
  HtmlConditionalRule,
  HtmlConditionalRuleType,
  Variable,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';
import faker from 'faker';
import { set } from 'lodash';
import { conditionalRulesHandler } from '../../../../fields/handlers/conditionalRules/conditionalRulesHandler';
import { CommonStepHandlers } from './commonStepHandlers';

const createHtmlRule = (): HtmlConditionalRule => {
  const type = faker.random.objectElement(HtmlConditionalRuleType);
  const definition =
    conditionalRuleDefinitions[ConditionalRuleType.HtmlElement];

  let rule: HtmlConditionalRule = {
    ruleType: ConditionalRuleType.HtmlElement,
    type: type as HtmlConditionalRuleType,
    condition: faker.random.objectElement(
      ConditionalRuleCondition
    ) as ConditionalRuleCondition,
  };

  const supportedConditions = (
    definition.supportedConditions as SupportedConditionsCallback<ConditionalRuleType.HtmlElement>
  )(rule, {});

  rule.condition = faker.random.objectElement(
    supportedConditions
  ) as ConditionalRuleCondition;

  const supportsValue = ruleSupportsValue(definition, rule.condition);

  if (rule.type === HtmlConditionalRuleType.Attribute) {
    rule.attribute = {
      attribute: faker.random.arrayElement([
        'data-id',
        'id',
        'data-test',
        'class',
        'href',
      ]),
    };
  }

  if (supportsValue) {
    const valueName = getHtmlRuleValueName(rule.type);

    rule = set(rule, valueName, faker.random.word());
  }

  return rule;
};

export const getConditionalRules = (variable: Variable) => [
  {
    matchType: ConditionalRuleGroupMatchType.Any,
    rules: [createHtmlRule()],
  },
  {
    matchType: ConditionalRuleGroupMatchType.Any,
    rules: [
      {
        ruleType: ConditionalRuleType.Date,
        expectedDate: format(faker.date.soon(), DateFormat.Date),
        condition: ConditionalRuleCondition.Equals,
      },
      {
        ruleType: ConditionalRuleType.Variable,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        variableKey: variable.key!,
        expectedValue: (() => {
          switch (variable.type) {
            case VariableType.Number:
              return faker.datatype.number();

            case VariableType.Date:
              return format(faker.date.recent(), DateFormat.Date);

            default:
              return faker.random.word();
          }
        })(),
        condition: ConditionalRuleCondition.Equals,
      },
    ],
  },
];

export const condition = (
  fieldNameCreator: FieldNameCreator,
  commonFields: CommonStepHandlers,
  variables: Variable[]
) => {
  const variable = faker.random.arrayElement(variables);

  return {
    ...commonFields.keyHandler,
    ...commonFields.url,
    [fieldNameCreator('conditionalRules')]: {
      handler: conditionalRulesHandler(
        getConditionalRules(variable),
        variables
      ),
    },
  };
};
