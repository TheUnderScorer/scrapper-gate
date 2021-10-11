import {
  ConditionalRuleTypes,
  ConditionalRuleWhen,
  HtmlElementRuleMeta,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper/mocks';
import {
  ConditionalRuleGroupType,
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
      id: '1',
      type: ConditionalRuleGroupType.All,
      rules: [
        {
          id: '1',
          type: ConditionalRuleTypes.HtmlElement,
          when: ConditionalRuleWhen.Exists,
          meta: {
            selectors,
            type: ConditionalRuleGroupType.All,
          } as HtmlElementRuleMeta,
        },
      ],
    },
  ];
  step.allSelectors = selectors;
  return step;
}
