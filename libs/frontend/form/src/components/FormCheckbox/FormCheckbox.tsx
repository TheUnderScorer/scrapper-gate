import React from 'react';
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
} from '@mui/material';
import { useField } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FieldProps } from '../../types';

export interface FormCheckboxProps<T>
  extends Pick<FormControlLabelProps, 'label'>,
    Omit<CheckboxProps, 'name' | 'defaultValue'> {
  fieldProps?: FieldProps<T>;
  name: string;
}

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

  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <FormControl error={hasError}>
      <FormControlLabel
        control={<Checkbox {...rest} {...input} id={id ?? input.name} />}
        label={label}
      />
      {hasError && <FormHelperText>{meta.error.message}</FormHelperText>}
    </FormControl>
  );
};
