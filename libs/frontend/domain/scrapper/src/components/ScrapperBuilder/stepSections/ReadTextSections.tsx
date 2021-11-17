import { EnumSelect } from '@scrapper-gate/frontend/form';
import { VariableType } from '@scrapper-gate/shared/schema';
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
      <EnumSelect
        enumObj={VariableType}
        name={fieldNameCreator('valueType')}
        label="Value type"
        defaultValue={VariableType.Text}
      />
      <Url
        fieldNameCreator={fieldNameCreator}
        nodeIndex={nodeIndex}
        disabled={formState.submitting}
      />
    </>
  );
};
