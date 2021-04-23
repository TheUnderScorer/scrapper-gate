import React from 'react';
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
} from '@material-ui/core';
import { FieldProps } from '@scrapper-gate/frontend/form';
import { useField } from 'react-final-form';

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

  return (
    <FormControl error={Boolean(meta.error)}>
      <FormControlLabel
        control={<Checkbox {...rest} {...input} id={id ?? input.name} />}
        label={label}
      />
      {meta.error && <FormHelperText>{meta.error.message}</FormHelperText>}
    </FormControl>
  );
};
