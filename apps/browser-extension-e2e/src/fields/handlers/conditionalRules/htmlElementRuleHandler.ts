/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getHtmlRuleValueName } from '@scrapper-gate/frontend/domain/conditional-rules';
import {
  conditionalRuleDefinitions,
  ruleSupportsValue,
} from '@scrapper-gate/shared/domain/conditional-rules';
import {
  ConditionalRuleCondition,
  ConditionalRuleType,
  HtmlConditionalRule,
  HtmlConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { get, set } from 'lodash';
import { FieldsHandler } from '../../FieldsHandler';
import { blockEditorHandler } from '../blockEditorHandler';
import { selectHandler } from '../selectHandler';
import { createConditionalRuleFieldHandler } from './createConditionalRuleFieldHandler';

export const htmlElementRuleHandler =
  createConditionalRuleFieldHandler<HtmlConditionalRule>({
    createFieldsHandler: (fieldNameCreator, page, rule) => {
      const supportsValue = ruleSupportsValue(
        conditionalRuleDefinitions[ConditionalRuleType.HtmlElement],
        rule.condition
      );

      const fieldsMap = {
        [fieldNameCreator('type')]: {
          handler: selectHandler(rule.type!),
        },
        [fieldNameCreator('condition')]: {
          handler: selectHandler(rule.condition),
        },
      };

      if (rule.type === HtmlConditionalRuleType.Attribute) {
        fieldsMap[fieldNameCreator('attribute.attribute')] = {
          handler: blockEditorHandler(rule.attribute!.attribute),
        };
      }

      if (supportsValue) {
        const valueName = getHtmlRuleValueName(rule.type);

        fieldsMap[fieldNameCreator(valueName)] = {
          handler: blockEditorHandler(get(rule, valueName)),
        };
      }

      return new FieldsHandler(fieldsMap, page);
    },
    getInputValue: async (fieldsHandler, fieldNameCreator) => {
      const type = await fieldsHandler.getValue(fieldNameCreator('type'));
      const condition = await fieldsHandler.getValue(
        fieldNameCreator('condition')
      );

      const supportsValue = ruleSupportsValue(
        conditionalRuleDefinitions[ConditionalRuleType.HtmlElement],
        condition
      );

      let rule: HtmlConditionalRule = {
        type: type as HtmlConditionalRuleType,
        condition: condition as ConditionalRuleCondition,
        ruleType: ConditionalRuleType.HtmlElement,
      };

      if (type === HtmlConditionalRuleType.Attribute) {
        rule.attribute = {
          attribute: await fieldsHandler.getValue(
            fieldNameCreator('attribute.attribute')
          ),
        };
      }

      if (supportsValue) {
        const valueName = getHtmlRuleValueName(type);

        rule = set(
          rule,
          valueName,
          await fieldsHandler.getValue(fieldNameCreator(valueName))
        );
      }

      return rule;
    },
  });
