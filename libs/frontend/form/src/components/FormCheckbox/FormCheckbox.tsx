import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
} from '@mui/material';
import React from 'react';
import { useField } from 'react-final-form';
import { useFieldError } from '../../hooks/useFieldError';
import { FormFieldProps } from '../../types';

export interface FormCheckboxProps<T>
  extends Pick<FormControlLabelProps, 'label'>,
    Omit<CheckboxProps, 'name' | 'defaultValue'>,
    FormFieldProps<T> {}

export const FormCheckbox = <T extends unknown>({
  name,
  fieldProps,
  required,
  label,
  id,
  ...rest
}: FormCheckboxProps<T>) => {
  const { input, meta } = useField(name, {
    ...fieldProps,
    type: 'checkbox',
  });

  const error = useFieldError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <FormControl error={Boolean(error)}>
      <FormControlLabel
        control={<Checkbox {...rest} {...input} id={id ?? input.name} />}
        label={label}
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};
