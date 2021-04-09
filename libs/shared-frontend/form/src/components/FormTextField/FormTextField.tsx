import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { ControllerProps, useController } from 'react-hook-form';

export interface FormTextFieldProps
  extends Omit<TextFieldProps, 'name'>,
    Pick<ControllerProps, 'defaultValue' | 'rules' | 'control' | 'name'> {}

export const FormTextField = ({
  defaultValue,
  rules,
  control,
  name,
  ...rest
}: FormTextFieldProps) => {
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
