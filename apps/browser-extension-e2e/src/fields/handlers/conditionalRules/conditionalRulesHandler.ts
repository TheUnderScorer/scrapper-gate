/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import { wait } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleGroup,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
  Variable,
  VariableConditionalRule,
} from '@scrapper-gate/shared/schema';
import { ElementHandle, Page } from 'playwright';
import { FieldHandler } from '../../fields.types';
import { selectHandler } from '../selectHandler';
import { dateRuleHandler } from './dateRuleHandler';
import { htmlElementRuleHandler } from './htmlElementRuleHandler';
import { variableRuleHandler } from './variableRuleHandler';

export const conditionalRulesHandler = (
  value: ConditionalRuleGroup[],
  variables: Variable[]
): FieldHandler<HTMLElement, ConditionalRuleGroup[]> => {
  const handlersMap = {
    [ConditionalRuleType.Date]: dateRuleHandler,
    [ConditionalRuleType.HtmlElement]: htmlElementRuleHandler,
    [ConditionalRuleType.Variable]: (rule: VariableConditionalRule) =>
      variableRuleHandler(variables, rule),
  };

  const fill = async (element: ElementHandle<HTMLElement>, page: Page) => {
    const addGroup = await element.waitForSelector('.add-rules-group');

    for (const group of value) {
      const groupIndex = value.indexOf(group);

      // By default, one group is always present
      if (groupIndex > 0) {
        await addGroup.click();
      }

      if (group.rules) {
        const groupEl = await element.waitForSelector(
          `.conditional-rules-group[data-index="${groupIndex}"]`
        );
        const addRuleBtn = await groupEl.waitForSelector('.add-rule');

        for (const rule of group.rules) {
          const ruleIndex = group.rules.indexOf(rule);

          await addRuleBtn.click();

          await page.click(`#${rule.ruleType}`);

          const ruleElement = await groupEl.waitForSelector(
            `.conditional-rules-rule[data-index="${ruleIndex}"]`
          );

          const handler = handlersMap[rule.ruleType](rule as any);

          await handler.fill(ruleElement as ElementHandle<HTMLElement>, page);
        }
      }
    }
  };
  return {
    providedValue: value,
    compare: (inputValue) => expect(inputValue).toEqual(value),
    fill,
    getInputValue: async (element, page) => {
      const result: ConditionalRuleGroup[] = [];

      const groups = await element.$$('.conditional-rules-group');

      for (const groupEl of groups) {
        const groupIndex = groups.indexOf(groupEl);
        const isOpen = await groupEl.evaluate((el) =>
          el.classList.contains('open')
        );

        if (!isOpen) {
          const summary = await groupEl.waitForSelector('.rule-group-summary');

          await summary.click();

          await wait(1000);
        }

        const matchTypeSelect = await groupEl.waitForSelector(
          '.match-type-select input'
        );
        const matchType = await selectHandler(
          value[groupIndex].matchType
        ).getInputValue(matchTypeSelect as ElementHandle<HTMLElement>, page);

        result[groupIndex] = {
          rules: [],
          matchType: matchType as ConditionalRuleGroupMatchType,
        };

        const rules = await groupEl.$$('.conditional-rules-rule');

        for (const ruleEl of rules) {
          const ruleIndex = rules.indexOf(ruleEl);
          const type = (await ruleEl.getAttribute(
            'data-rule-type'
          )) as ConditionalRuleType;

          const handler = handlersMap[type](
            value[groupIndex].rules![ruleIndex] as any
          );

          result[groupIndex].rules![ruleIndex] = await handler.getInputValue(
            ruleEl as ElementHandle<HTMLElement>,
            page
          );
        }
      }

      return result;
    },
  };
};
