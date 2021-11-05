import { Stack } from '@mui/material';
import { VariablesTextField } from '@scrapper-gate/frontend/domain/variables';
import { EnumSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';
import {
  Maybe,
  ScrapperDialogBehaviour,
  ScrapperNoElementsFoundBehavior,
} from '@scrapper-gate/shared/schema';
import React from 'react';
import { ScrapperRunSettingsFormProps } from './ScrapperRunSettingsForm.types';

export const ScrapperRunSettingsForm = ({
  getFieldName,
  disabled,
}: ScrapperRunSettingsFormProps) => {
  const dialogBehaviour = useFormFieldValue<Maybe<ScrapperDialogBehaviour>>(
    getFieldName('dialogBehaviour')
  );

  return (
    <Stack spacing={4}>
      <EnumSelect
        disabled={disabled}
        enumObj={ScrapperDialogBehaviour}
        name={getFieldName('dialogBehaviour')}
        label="Alert behaviour"
        helperText="Decides what action should be taken after browser alert is shown."
      />
      <EnumSelect
        disabled={disabled}
        label="No elements found behaviour"
        helperText="Decides what action should be taken if no HTML elements were found for current step."
        dictionary={{
          [ScrapperNoElementsFoundBehavior.Fail]: {
            label: 'Exit run',
          },
          [ScrapperNoElementsFoundBehavior.Continue]: {
            label: 'Continue run',
          },
        }}
        enumObj={ScrapperNoElementsFoundBehavior}
        name={getFieldName('noElementsFoundBehavior')}
      />
      {dialogBehaviour === ScrapperDialogBehaviour.AlwaysConfirm && (
        <VariablesTextField
          disabled={disabled}
          name={getFieldName('promptText')}
          label="Prompt text"
          helperText="Text to enter into prompt alerts."
        />
      )}
    </Stack>
  );
};
