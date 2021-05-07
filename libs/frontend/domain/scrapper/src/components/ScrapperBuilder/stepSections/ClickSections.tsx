import React, { memo } from 'react';
import { Box, MenuItem, Select } from '@material-ui/core';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { useFormState } from 'react-final-form';
import { Incrementator } from '@scrapper-gate/frontend/ui';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';
import { Url } from '../commonFields/Url';
import { mouseButtonsMapArr } from '../../../dictionary/mouseButtonsMap';
import { FormSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';

export const ClickSections = memo(
  ({ ElementPicker, nodeIndex, fieldNameCreator }: ScrapperStepFormProps) => {
    const formState = useFormState({
      subscription: {
        submitting: true,
      },
    });

    const clickTimes = useFormFieldValue<number>(
      fieldNameCreator('clickTimes')
    );

    return (
      <>
        <ScrapperKey
          fieldNameCreator={fieldNameCreator}
          disabled={formState.submitting}
        />
        <FormSelect
          variant="outlined"
          label="Mouse button"
          name={fieldNameCreator('mouseButton')}
        >
          {mouseButtonsMapArr.map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </FormSelect>
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
  }
);
