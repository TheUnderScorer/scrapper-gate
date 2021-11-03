import {
  ConditionalRulesSelection,
  dateRule,
  makeHtmlElementRuleWithPicker,
  variableRule,
} from '@scrapper-gate/frontend/domain/conditional-rules';
import { ScrapperElementPicker } from '@scrapper-gate/frontend/domain/scrapper';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import React, { useMemo } from 'react';
import { useFormState } from 'react-final-form';

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

  return useMemo<ConditionalRulesSelection[]>(
    () => [
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
    ],
    [ElementPicker, fieldNameCreator, formState.submitting, nodeIndex]
  );
}
