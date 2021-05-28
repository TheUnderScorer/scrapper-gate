import { TextField, TextFieldProps } from '@material-ui/core';
import { setRefValue } from '@scrapper-gate/frontend/common';
import React, { Ref, useState } from 'react';
import { useField } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FieldProps } from '../../types';

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
  focusOnMount?: boolean;
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
  focusOnMount,
  ...rest
}: FormTextFieldProps<T>) => {
  const [didFocus, setDidFocus] = useState(false);

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
      ref={(element) => {
        if (focusOnMount && !didFocus && element) {
          element.querySelector('input')?.focus();

          setDidFocus(true);
        }

        setRefValue(inputRef, element);
      }}
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
