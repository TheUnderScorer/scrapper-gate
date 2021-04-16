import React from 'react';
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
} from '@material-ui/core';
import { FieldControllerProps } from '@scrapper-gate/frontend/form';
import { Controller } from 'react-hook-form';

export interface FormCheckboxProps<T>
  extends Pick<FormControlLabelProps, 'label'>,
    FieldControllerProps<T>,
    Omit<CheckboxProps, 'name' | 'defaultValue'> {}

export const FormCheckbox = <T extends unknown>({
  name,
  rules,
  control,
  required,
  label,
  defaultValue,
  ...rest
}: FormCheckboxProps<T>) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FormControl error={Boolean(fieldState.error)}>
          <FormControlLabel
            control={<Checkbox {...rest} {...field} />}
            label={label}
          />
          {fieldState.error && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
