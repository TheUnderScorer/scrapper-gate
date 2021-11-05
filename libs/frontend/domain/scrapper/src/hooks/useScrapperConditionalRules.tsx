import {
  ConditionalRulesSelection,
  dateRule,
  makeHtmlElementRuleWithPicker,
  variableRule,
} from '@scrapper-gate/frontend/domain/conditional-rules';
import {
  FieldNameCreator,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import { scrapperStepActionDefinitions } from '@scrapper-gate/shared/domain/scrapper';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import React, { useMemo } from 'react';
import { useFormState } from 'react-final-form';
import { ScrapperElementPicker } from '../components/ScrapperBuilder/ScrapperBuilder.types';

interface UseScrapperConditionalRulesParams {
  fieldNameCreator: FieldNameCreator;
  ElementPicker: ScrapperElementPicker;
  nodeIndex: number;
}

export function useScrapperConditionalRules({
  fieldNameCreator,
  ElementPicker,
  nodeIndex,
}: UseScrapperConditionalRulesParams) {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  const action = useFormFieldValue<ScrapperAction>(fieldNameCreator('action'));
  const actionDefinition = action
    ? scrapperStepActionDefinitions[action]
    : undefined;

  return useMemo<ConditionalRulesSelection[]>(() => {
    if (!actionDefinition) {
      return [];
    }

    const rules = [
      dateRule,
      variableRule,
      makeHtmlElementRuleWithPicker(({ name, variant }) => (
        <ElementPicker
          nodeIndex={nodeIndex}
          name={name}
          fieldNameCreator={fieldNameCreator}
          disabled={formState.submitting}
          variant={variant}
        />
      )),
    ];

    return rules.filter((rule) =>
      actionDefinition.supportedConditionalTypes?.includes(rule.value.type)
    );
  }, [
    ElementPicker,
    actionDefinition,
    fieldNameCreator,
    formState.submitting,
    nodeIndex,
  ]);
}
