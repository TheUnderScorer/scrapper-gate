import React, { useMemo } from 'react';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';
import { useFormState } from 'react-final-form';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import {
  ConditionalRules,
  ConditionalRulesSelection,
  dateRule,
  makeHtmlElementRuleWithPicker,
} from '@scrapper-gate/frontend/domain/conditional-rules';
import { ConditionalRuleGroupType } from '@scrapper-gate/shared/schema';
import { Url } from '../commonFields/Url';

export const ConditionalSections = ({
  fieldNameCreator,
  ElementPicker,
  ...rest
}: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  const rules = useMemo<ConditionalRulesSelection[]>(
    () => [
      dateRule,
      makeHtmlElementRuleWithPicker((name) => (
        <ElementPicker
          {...rest}
          name={name}
          fieldNameCreator={fieldNameCreator}
          disabled={formState.submitting}
        />
      )),
    ],
    [ElementPicker, fieldNameCreator, formState.submitting, rest]
  );

  return (
    <>
      <ScrapperKey
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
      />
      <ConditionalRules
        label="Rules"
        helperText="Configure conditional rules for this step"
        definitions={rules}
        name={fieldNameCreator('conditionalRules')}
        initialValue={[
          {
            type: ConditionalRuleGroupType.Any,
            rules: [],
          },
        ]}
      />
      <Url
        fieldNameCreator={fieldNameCreator}
        nodeIndex={rest.nodeIndex}
        disabled={formState.submitting}
      />
    </>
  );
};
