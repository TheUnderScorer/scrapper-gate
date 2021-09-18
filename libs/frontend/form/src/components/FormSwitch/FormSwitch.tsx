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

export interface FormSwitchProps extends Omit<BaseSwitchProps, 'name'> {
  label?: string;
  name: string;
  helperText?: string;
  labelProps?: Omit<FormControlLabelProps, 'label' | 'control'>;
}

export const FormSwitch = ({
  label,
  name,
  helperText,
  labelProps = {},
  ...rest
}: FormSwitchProps) => {
  const { input } = useField<boolean>(name, {
    type: 'checkbox',
  });

  return (
    <Box>
      <FormControlLabel
        {...labelProps}
        disabled={rest.disabled}
        label={label}
        control={<BaseSwitch {...rest} {...input} />}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </Box>
  );
};
