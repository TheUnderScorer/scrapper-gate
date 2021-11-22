import { ConditionalRules } from '@scrapper-gate/frontend/domain/conditional-rules';
import { ConditionalRuleGroupMatchType } from '@scrapper-gate/shared/schema';
import React from 'react';
import { useFormState } from 'react-final-form';
import { useScrapperConditionalRules } from '../../../hooks/useScrapperConditionalRules';
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

  const rules = useScrapperConditionalRules({
    ElementPicker,
    fieldNameCreator,
    nodeIndex: rest.nodeIndex,
  });

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
            matchType: ConditionalRuleGroupMatchType.Any,
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
