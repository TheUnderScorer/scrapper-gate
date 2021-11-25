import React from 'react';
import {
  Box,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  Switch as BaseSwitch,
  SwitchProps as BaseSwitchProps,
} from '@mui/material';
import { useField } from 'react-final-form';
import { FormFieldProps } from '../../types';

export interface FormSwitchProps
  extends Omit<BaseSwitchProps, 'name'>,
    FormFieldProps<boolean> {
  label?: string;
  helperText?: string;
  labelProps?: Omit<FormControlLabelProps, 'label' | 'control'>;
}

export const FormSwitch = ({
  label,
  name,
  helperText,
  labelProps = {},
  fieldProps,
  ...rest
}: FormSwitchProps) => {
  const { input } = useField<boolean>(name, {
    type: 'checkbox',
    ...fieldProps,
  });

  return (
    <Box>
      <FormControlLabel
        {...labelProps}
        disabled={rest.disabled}
        label={label ?? ''}
        control={<BaseSwitch {...rest} {...input} />}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </Box>
  );
};
