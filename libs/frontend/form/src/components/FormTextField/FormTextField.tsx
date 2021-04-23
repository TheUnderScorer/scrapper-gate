import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { FieldProps } from '../../types';
import { useField } from 'react-final-form';

export interface FormTextFieldProps<T>
  extends Pick<
      TextFieldProps,
      | 'helperText'
      | 'variant'
      | 'fullWidth'
      | 'label'
      | 'id'
      | 'size'
      | 'disabled'
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
  id,
  size,
  disabled,
  ...rest
}: FormTextFieldProps<T>) => {
  const { input, meta } = useField(name, {
    ...rest,
  });

  console.log({
    input,
    meta,
  });

  return (
    <TextField
      {...rest}
      label={label}
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      error={Boolean(meta.error)}
      helperText={meta.error ? meta.error.message : helperText}
      id={id ?? input.name}
      disabled={disabled}
      {...input}
    />
  );
};
