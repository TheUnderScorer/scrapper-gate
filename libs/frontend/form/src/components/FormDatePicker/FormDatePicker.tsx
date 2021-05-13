import React from 'react';
import { DatePickerProps, KeyboardDatePicker } from '@material-ui/pickers';
import { useField } from 'react-final-form';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { FieldProps } from '../../types';
import { useFieldHasError } from '../../hooks/useFieldHasError';

export interface FormDatePickerProps<T>
  extends Omit<DatePickerProps, 'name' | 'value' | 'onChange'> {
  name: string;
  fieldProps?: FieldProps<T>;
}

export const FormDatePicker = <T extends ParsableDate>({
  name,
  fieldProps,
  ...rest
}: FormDatePickerProps<T>) => {
  const { input, meta } = useField(name, {
    ...fieldProps,
  });
  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <KeyboardDatePicker
      {...rest}
      error={hasError}
      helperText={hasError ? meta.error.message : rest.helperText}
      {...input}
    />
  );
};
