import React from 'react';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';
import { useFormState } from 'react-final-form';
import { Url } from '../commonFields/Url';

export const ReadTextSections = ({
  ElementPicker,
  nodeIndex,
  fieldNameCreator,
}: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  return (
    <>
      <ScrapperKey
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
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
