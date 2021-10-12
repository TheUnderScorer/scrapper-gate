import { Stack } from '@mui/material';
import { EnumSelect } from '@scrapper-gate/frontend/form';
import {
  ScrapperDialogBehaviour,
  ScrapperNoElementsFoundBehavior,
} from '@scrapper-gate/shared/schema';
import React from 'react';
import { ScrapperRunSettingsFormProps } from './ScrapperRunSettingsForm.types';

export const ScrapperRunSettingsForm = ({
  getFieldName,
  initialValue,
}: ScrapperRunSettingsFormProps) => {
  return (
    <Stack spacing={2}>
      <EnumSelect
        defaultValue={initialValue?.dialogBehaviour}
        enumObj={ScrapperDialogBehaviour}
        name={getFieldName('dialogBehaviour')}
        label="Alert behaviour"
        helperText="Decides what action should be taken after browser alert is shown."
      />
      <EnumSelect
        defaultValue={initialValue?.noElementsFoundBehavior}
        label="No elements found behaviour"
        helperText="Decides what action should be taken if no HTML elements were found for current step."
        dictionary={{
          [ScrapperNoElementsFoundBehavior.Fail]: 'Exit run',
          [ScrapperNoElementsFoundBehavior.Continue]: 'Continue run',
        }}
        enumObj={ScrapperNoElementsFoundBehavior}
        name={getFieldName('noElementsFoundBehavior')}
      />
    </Stack>
  );
};
