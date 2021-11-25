import { TextField, TextFieldProps } from '@mui/material';
import { setRefValue } from '@scrapper-gate/frontend/common';
import React, { Ref, useState } from 'react';
import { useField } from 'react-final-form';
import { useFieldError } from '../../hooks/useFieldError';
import { FormFieldProps } from '../../types';

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
    FormFieldProps<T> {
  name: string;
  inputRef?: Ref<HTMLInputElement>;
  focusOnMount?: boolean;
}

export const FormTextField = <T extends unknown>({
  name,
  variant,
  id,
  inputRef,
  focusOnMount,
  helperText,
  fieldProps,
  ...rest
}: FormTextFieldProps<T>) => {
  const [didFocus, setDidFocus] = useState(false);

  const { input, meta } = useField(name, {
    ...rest,
    parse: (value) => {
      return fieldProps?.type === 'number' ? parseFloat(value) : value;
    },
    ...fieldProps,
  });

  const error = useFieldError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <TextField
      ref={(element) => {
        if (focusOnMount && !didFocus && element) {
          element.querySelector('input')?.focus();

          setDidFocus(true);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setRefValue(inputRef!, element);
      }}
      variant={variant}
      error={Boolean(error)}
      helperText={error ? error.message : helperText}
      id={id ?? input.name}
      InputProps={rest.InputProps}
      {...rest}
      {...input}
    />
  );
};
