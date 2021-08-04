import {
  ConditionalRules,
  ConditionalRulesSelection,
  dateRule,
  makeHtmlElementRuleWithPicker,
  variableRule,
} from '@scrapper-gate/frontend/domain/conditional-rules';
import { ConditionalRuleGroupType } from '@scrapper-gate/shared/schema';
import React, { useMemo } from 'react';
import { useFormState } from 'react-final-form';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { Url } from '../commonFields/Url';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

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
      variableRule,
      makeHtmlElementRuleWithPicker(({ name, variant }) => (
        <ElementPicker
          {...rest}
          name={name}
          fieldNameCreator={fieldNameCreator}
          disabled={formState.submitting}
          variant={variant}
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
        fieldVariant="standard"
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
