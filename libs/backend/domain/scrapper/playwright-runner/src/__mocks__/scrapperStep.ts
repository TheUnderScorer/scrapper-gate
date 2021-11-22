import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper/mocks';
import {
  ConditionalRuleCondition,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
  HtmlConditionalRuleType,
  ScrapperAction,
  Selector,
} from '@scrapper-gate/shared/schema';

export async function createScrapperStepForConditionalTest(
  selectors: Selector[]
) {
  const step = await createMockScrapperStep({});

  step.url = 'http://localhost:8080';
  step.useUrlFromPreviousStep = false;
  step.action = ScrapperAction.Condition;
  step.conditionalRules = [
    {
      matchType: ConditionalRuleGroupMatchType.All,
      rules: [
        {
          ruleType: ConditionalRuleType.HtmlElement,
          condition: ConditionalRuleCondition.Exists,
          selectors,
          type: HtmlConditionalRuleType.Element,
          matchType: ConditionalRuleGroupMatchType.All,
        },
      ],
    },
  ];

  step.allSelectors = selectors;
  return step;
}
