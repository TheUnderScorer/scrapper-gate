import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { FieldProps } from '../../types';
import { useField } from 'react-final-form';

export interface FormTextFieldProps<T>
  extends Pick<
      TextFieldProps,
      'helperText' | 'variant' | 'fullWidth' | 'label'
    >,
    FieldProps<T> {
  name: string;
}

export const FormTextField = <T extends unknown>({
  defaultValue,
  name,
  helperText,
  variant,
  label,
  fullWidth,
  ...rest
}: FormTextFieldProps<T>) => {
  const { input, meta } = useField(name, {
    ...rest,
  });

  return (
    <TextField
      {...rest}
      label={label}
      fullWidth={fullWidth}
      variant={variant}
      error={Boolean(meta.error)}
      helperText={meta.error ? meta.error.message : helperText}
      {...input}
    />
  );
};
