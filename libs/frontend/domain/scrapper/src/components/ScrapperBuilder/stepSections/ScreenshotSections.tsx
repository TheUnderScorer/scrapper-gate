import { FormSwitch, useFormFieldValue } from '@scrapper-gate/frontend/form';
import { Maybe, Selector } from '@scrapper-gate/shared/schema';
import React from 'react';
import { useFormState } from 'react-final-form';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { Url } from '../commonFields/Url';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const ScreenshotSections = ({
  ElementPicker,
  fieldNameCreator,
  nodeIndex,
}: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  const selectors = useFormFieldValue<Maybe<Selector>[]>(
    fieldNameCreator('selectors')
  );

  return (
    <>
      <ScrapperKey
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
      />
      <FormSwitch
        disabled={Boolean(selectors?.length)}
        helperText="If selected, will take a full page screenshot rather than only current viewport."
        name={fieldNameCreator('fullPageScreenshot')}
        label="Take full page screenshot"
      />
      <ElementPicker
        nodeIndex={nodeIndex}
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
      />
      <Url
        fieldNameCreator={fieldNameCreator}
        nodeIndex={nodeIndex}
        disabled={formState.submitting}
      />
    </>
  );
};
