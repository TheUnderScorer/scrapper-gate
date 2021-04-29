import { isEditable } from '@testing-library/user-event/dist/utils';
import { Input, Timer } from '@material-ui/icons';
import { useCallback } from 'react';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { InputAdornment } from '@material-ui/core';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';
import { useFormState } from 'react-final-form';
import { Url } from '../commonFields/Url';
import { wordFormByNumber } from '@scrapper-gate/shared/common';
import { FormTextField } from '@scrapper-gate/frontend/form';

export const TypeSections = ({
  ElementPicker,
  nodeIndex,
  fieldNameCreator,
}: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  const elementsValidator = useCallback((elements: Element[]) => {
    const areAllElementsEditable = elements.every((element) =>
      isEditable(element as HTMLElement)
    );

    return areAllElementsEditable
      ? undefined
      : wordFormByNumber(
          'Selected element is not editable.',
          'Some of the selected elements are not editable.',
          elements.length
        );
  }, []);

  return (
    <>
      <ScrapperKey
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
      />
      <ElementPicker
        nodeIndex={nodeIndex}
        fieldNameCreator={fieldNameCreator}
        elementsValidator={elementsValidator}
      />
      <Url
        fieldNameCreator={fieldNameCreator}
        nodeIndex={nodeIndex}
        disabled={formState.submitting}
      />
      <FormTextField
        disabled={formState.submitting}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Input />
            </InputAdornment>
          ),
        }}
        label="Value"
        name={fieldNameCreator('typeValue')}
        helperText="Value to type into input"
      />
      <FormTextField
        name={fieldNameCreator('typeDelay')}
        type="number"
        disabled={formState.submitting}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Timer />
            </InputAdornment>
          ),
          endAdornment: <InputAdornment position="end">MS</InputAdornment>,
        }}
        label="Type delay"
        helperText="Delay used between typing each letter"
      />
    </>
  );
};
