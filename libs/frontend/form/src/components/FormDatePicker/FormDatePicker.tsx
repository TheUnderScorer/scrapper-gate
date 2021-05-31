import { TextField, TextFieldProps } from '@material-ui/core';
import { DesktopDatePicker, DesktopDatePickerProps } from '@material-ui/lab';
import { useContainerStore } from '@scrapper-gate/frontend/common';
import React from 'react';
import { useField } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FieldProps } from '../../types';

export interface FormDatePickerProps<T>
  extends Omit<Partial<DesktopDatePickerProps>, 'name' | 'value' | 'onChange'>,
    Pick<
      TextFieldProps,
      'helperText' | 'variant' | 'placeholder' | 'fullWidth'
    > {
  name: string;
  fieldProps?: FieldProps<T>;
}

export const FormDatePicker = <T extends unknown>({
  name,
  fieldProps,
  variant,
  placeholder,
  fullWidth,
  ...rest
}: FormDatePickerProps<T>) => {
  const container = useContainerStore((store) => store.container);

  const { input, meta } = useField(name, {
    ...fieldProps,
    format: (value) => {
      if (!value) {
        return value;
      }

      if (typeof value === 'string') {
        try {
          return new Date(value);
        } catch {
          return null;
        }
      }

      return value;
    },
  });
  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <DesktopDatePicker
      {...rest}
      {...input}
      PopperProps={{
        container,
        style: {
          pointerEvents: 'all',
        },
      }}
      renderInput={(props) => {
        return (
          <TextField
            {...props}
            id={name}
            name={name}
            error={hasError}
            helperText={hasError ? meta.error.message : rest.helperText}
            variant={variant ?? props.variant}
            placeholder={placeholder ?? props.placeholder}
            fullWidth={fullWidth}
            inputProps={{
              ...props.inputProps,
              // By default mui provides us value with today date, we don't want that
              value: input.value ? props.inputProps.value : null,
            }}
          />
        );
      }}
    />
  );
};
