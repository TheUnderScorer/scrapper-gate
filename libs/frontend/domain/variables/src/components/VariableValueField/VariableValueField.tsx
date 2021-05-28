import {
  FormDatePicker,
  FormTextField,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import { DateFormat } from '@scrapper-gate/shared/common';
import { Variable, VariableType } from '@scrapper-gate/shared/schema';
import React from 'react';

export interface VariableValueFieldProps {
  // Name under which whole variable can be found in form
  variableName: string;
  name: string;
}

export const VariableValueField = ({
  variableName,
  name,
}: VariableValueFieldProps) => {
  const variable = useFormFieldValue<Variable>(variableName);

  switch (variable.type) {
    case VariableType.Date:
      return (
        <FormDatePicker
          inputFormat={DateFormat.Date}
          name={name}
          variant="standard"
        />
      );

    case VariableType.Text:
    default:
      return <FormTextField variant="standard" name={name} focusOnMount />;
  }
};
