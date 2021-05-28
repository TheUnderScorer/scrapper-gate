import { TextField, TextFieldProps } from '@material-ui/core';
import { DesktopDatePicker, DesktopDatePickerProps } from '@material-ui/lab';
import React from 'react';
import { useField } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FieldProps } from '../../types';

export interface FormDatePickerProps<T>
  extends Omit<Partial<DesktopDatePickerProps>, 'name' | 'value' | 'onChange'>,
    Pick<TextFieldProps, 'helperText' | 'variant'> {
  name: string;
  fieldProps?: FieldProps<T>;
}

export const FormDatePicker = <T extends unknown>({
  name,
  fieldProps,
  variant,
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
    <DesktopDatePicker
      {...rest}
      {...input}
      renderInput={(props) => (
        <TextField
          {...props}
          id={name}
          name={name}
          error={hasError}
          helperText={hasError ? meta.error.message : rest.helperText}
          variant={variant ?? props.variant}
        />
      )}
    />
  );
};
