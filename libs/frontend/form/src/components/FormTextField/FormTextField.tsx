import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { useController } from 'react-hook-form';
import { FieldControllerProps } from '../../types';

export interface FormTextFieldProps<T>
  extends Omit<TextFieldProps, 'name'>,
    FieldControllerProps<T> {}

export const FormTextField = <T extends unknown>({
  defaultValue,
  rules,
  control,
  name,
  ...rest
}: FormTextFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    rules,
    control,
    defaultValue,
  });

  return (
    <TextField
      {...rest}
      {...field}
      variant={rest.variant}
      error={Boolean(error)}
      helperText={error ? error.message : rest.helperText}
    />
  );
};
