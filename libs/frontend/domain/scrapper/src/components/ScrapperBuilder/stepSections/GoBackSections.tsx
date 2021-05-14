import React from 'react';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { useFormState } from 'react-final-form';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const GoBackSections = ({ fieldNameCreator }: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  return (
    <ScrapperKey
      fieldNameCreator={fieldNameCreator}
      disabled={formState.submitting}
    />
  );
};
