import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { FieldProps } from '../../types';
import { useField } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';

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
      | 'InputProps'
      | 'placeholder'
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
  placeholder,
  showErrorOnlyOnTouched,
  ...rest
}: FormTextFieldProps<T>) => {
  const { input, meta } = useField(name, {
    ...rest,
  });

  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched,
  });

  return (
    <TextField
      {...rest}
      placeholder={placeholder}
      label={label}
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      error={hasError}
      helperText={hasError ? meta.error.message : helperText}
      id={id ?? input.name}
      disabled={disabled}
      {...input}
    />
  );
};
