import { TextField, TextFieldProps } from '@material-ui/core';
import { DesktopDatePicker, DesktopDatePickerProps } from '@material-ui/lab';
import { useContainerStore } from '@scrapper-gate/frontend/common';
import React from 'react';
import { useField } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FieldProps } from '../../types';

export interface FormDatePickerProps<T>
  extends Omit<Partial<DesktopDatePickerProps>, 'name' | 'value'>,
    Pick<
      TextFieldProps,
      'helperText' | 'variant' | 'placeholder' | 'fullWidth'
    > {
  name: string;
  fieldProps?: FieldProps<T>;
  formatTextFieldValue?: (value: string | null) => string | null;
  formatValue?: (value: unknown) => string | Date;
}

export const FormDatePicker = <T extends unknown>({
  name,
  fieldProps,
  variant,
  placeholder,
  fullWidth,
  formatTextFieldValue,
  formatValue,
  onChange,
  ...rest
}: FormDatePickerProps<T>) => {
  const container = useContainerStore((store) => store.container);

  const { input, meta } = useField(name, {
    ...fieldProps,
    format: (value) => {
      if (formatValue) {
        return formatValue(value);
      }

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
      onChange={(date, selectionState) => {
        input.onChange(date);
        onChange?.(date, selectionState);
      }}
      PopperProps={{
        container,
        style: {
          pointerEvents: 'all',
        },
      }}
      renderInput={(props) => {
        const value = input.value ?? props.inputProps.value;

        const additionalProps = {
          helperText: hasError ? meta.error.message : rest.helperText,
          variant: variant ?? props.variant,
          placeholder: placeholder ?? props.placeholder,
          fullWidth,
          id: name,
          name,
          error: hasError,
          inputProps: {
            ...props.inputProps,
            // By default mui provides us value with today date, we don't want that
            value: formatTextFieldValue
              ? formatTextFieldValue(value ?? props.inputProps)
              : value,
          },
        };

        if (rest.renderInput) {
          return rest.renderInput({
            ...props,
            ...additionalProps,
          });
        }

        return <TextField {...props} {...additionalProps} />;
      }}
    />
  );
};
