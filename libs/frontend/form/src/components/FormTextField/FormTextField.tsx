import React, { Ref } from 'react';
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
      | 'onKeyUp'
      | 'onKeyDown'
      | 'onKeyPress'
      | 'inputProps'
    >,
    FieldProps<T> {
  name: string;
  inputRef?: Ref<HTMLInputElement>;
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
  inputRef,
  onKeyUp,
  onKeyDown,
  onKeyPress,
  inputProps,
  ...rest
}: FormTextFieldProps<T>) => {
  const { input, meta } = useField(name, {
    ...rest,
    parse: (value) => {
      return rest.type === 'number' ? parseFloat(value) : value;
    },
  });

  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched,
  });

  return (
    <TextField
      ref={inputRef}
      placeholder={placeholder}
      label={label}
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      error={hasError}
      helperText={hasError ? meta.error.message : helperText}
      id={id ?? input.name}
      disabled={disabled}
      InputProps={rest.InputProps}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onKeyPress={onKeyPress}
      inputProps={inputProps}
      {...input}
    />
  );
};
