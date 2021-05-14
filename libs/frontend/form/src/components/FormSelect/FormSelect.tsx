import React, { PropsWithChildren } from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectProps,
  TextFieldProps,
} from '@material-ui/core';
import { useField } from 'react-final-form';

export interface FormSelectProps
  extends Pick<
      SelectProps,
      'multiple' | 'variant' | 'fullWidth' | 'defaultValue' | 'className'
    >,
    Pick<TextFieldProps, 'label' | 'helperText'> {
  name: string;
}

export const FormSelect = ({
  label,
  name,
  defaultValue,
  variant,
  children,
  multiple,
  helperText,
  ...props
}: PropsWithChildren<FormSelectProps>) => {
  const {
    input,
    meta: { error },
  } = useField(name, {
    multiple,
    initialValue: defaultValue,
  });

  return (
    <FormControl id={name} variant={variant} error={Boolean(error)}>
      {label && <InputLabel htmlFor={name}>{label}</InputLabel>}
      <Select {...input} label={label} multiple={multiple} {...props}>
        {children}
      </Select>
      {(helperText || error) && (
        <FormHelperText>{error?.message ?? helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
