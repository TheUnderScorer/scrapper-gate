import { Stack } from '@mui/material';
import { VariablesTextField } from '@scrapper-gate/frontend/domain/variables';
import { EnumSelect } from '@scrapper-gate/frontend/form';
import {
  ScrapperDialogBehaviour,
  ScrapperNoElementsFoundBehavior,
} from '@scrapper-gate/shared/schema';
import React from 'react';
import { ScrapperRunSettingsFormProps } from './ScrapperRunSettingsForm.types';

export const ScrapperRunSettingsForm = ({
  getFieldName,
}: ScrapperRunSettingsFormProps) => {
  return (
    <Stack spacing={4}>
      <EnumSelect
        enumObj={ScrapperDialogBehaviour}
        name={getFieldName('dialogBehaviour')}
        label="Alert behaviour"
        helperText="Decides what action should be taken after browser alert is shown."
      />
      <EnumSelect
        label="No elements found behaviour"
        helperText="Decides what action should be taken if no HTML elements were found for current step."
        dictionary={{
          [ScrapperNoElementsFoundBehavior.Fail]: 'Exit run',
          [ScrapperNoElementsFoundBehavior.Continue]: 'Continue run',
        }}
        enumObj={ScrapperNoElementsFoundBehavior}
        name={getFieldName('noElementsFoundBehavior')}
      />
      <VariablesTextField
        name={getFieldName('promptText')}
        label="Prompt text"
        helperText="Text to enter into prompt alerts."
      />
    </Stack>
  );
};
