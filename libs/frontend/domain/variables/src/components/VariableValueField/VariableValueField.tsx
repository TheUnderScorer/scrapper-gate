import { FormDatePicker, FormTextField } from '@scrapper-gate/frontend/form';
import { DateFormat } from '@scrapper-gate/shared/common';
import { VariableType } from '@scrapper-gate/shared/schema';
import React from 'react';

export interface VariableValueFieldProps {
  name: string;
  type: VariableType;
  placeholder?: string;
}

export const VariableValueField = ({
  type,
  name,
  placeholder,
}: VariableValueFieldProps) => {
  switch (type) {
    case VariableType.Date:
      return (
        <FormDatePicker
          inputFormat={DateFormat.Date}
          name={name}
          variant="standard"
          fullWidth
        />
      );

    case VariableType.Text:
    default:
      return (
        <FormTextField
          fullWidth
          placeholder={placeholder}
          variant="standard"
          name={name}
        />
      );
  }
};
