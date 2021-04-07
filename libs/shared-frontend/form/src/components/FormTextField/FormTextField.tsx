import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { ControllerProps, Controller } from 'react-hook-form';

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
  return (
    <Controller
      defaultValue={defaultValue}
      rules={rules}
      control={control}
      name={name}
      render={(props) => (
        <TextField
          {...rest}
          {...props.field}
          variant={rest.variant}
          error={Boolean(props.fieldState.error)}
          helperText={
            props.fieldState.error
              ? props.fieldState.error.message
              : rest.helperText
          }
        />
      )}
    />
  );
};
