import { Box } from '@mui/material';
import { EnumSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';
import { Incrementator } from '@scrapper-gate/frontend/ui';
import { MouseButton } from '@scrapper-gate/shared/schema';
import React from 'react';
import { useFormState } from 'react-final-form';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { Url } from '../commonFields/Url';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const ClickSections = ({
  ElementPicker,
  nodeIndex,
  fieldNameCreator,
}: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  const clickTimes = useFormFieldValue<number>(fieldNameCreator('clickTimes'));

  return (
    <>
      <ScrapperKey
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
      />
      <EnumSelect
        enumObj={MouseButton}
        variant="outlined"
        label="Mouse button"
        name={fieldNameCreator('mouseButton')}
      />
      <Url
        nodeIndex={nodeIndex}
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
      />
      <ElementPicker
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
        nodeIndex={nodeIndex}
      />
      <Box width="100%" display="flex" justifyContent="center">
        <Incrementator
          name={fieldNameCreator('clickTimes')}
          disabled={formState.submitting}
          bottomText="Click times"
          minValue={1}
          initialValue={clickTimes || 1}
        />
      </Box>
    </>
  );
};
