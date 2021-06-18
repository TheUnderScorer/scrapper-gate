import React, { PropsWithChildren } from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectProps,
  TextFieldProps,
} from '@material-ui/core';
import { useField } from 'react-final-form';
import { useToggle } from 'react-use';

export interface FormSelectProps
  extends Pick<
      SelectProps,
      | 'multiple'
      | 'variant'
      | 'fullWidth'
      | 'defaultValue'
      | 'className'
      | 'onClick'
      | 'onMouseDown'
      | 'size'
      | 'style'
      | 'MenuProps'
      | 'open'
    >,
    Pick<TextFieldProps, 'label' | 'helperText'> {
  name: string;
  initialOpen?: boolean;
}

export const FormSelect = ({
  label,
  name,
  defaultValue,
  variant,
  children,
  multiple,
  helperText,
  initialOpen,
  ...props
}: PropsWithChildren<FormSelectProps>) => {
  const [open, toggleOpen] = useToggle(Boolean(initialOpen));

  const {
    input,
    meta: { error },
  } = useField(name, {
    multiple,
    initialValue: defaultValue,
  });

  return (
    <FormControl id={name} variant={variant} error={Boolean(error)}>
      {label && <InputLabel htmlFor={name}>{label}</InputLabel>}
      <Select
        {...input}
        open={open}
        onOpen={() => toggleOpen(true)}
        onClose={() => toggleOpen(false)}
        label={label}
        multiple={multiple}
        {...props}
      >
        {children}
      </Select>
      {(helperText || error) && (
        <FormHelperText>{error?.message ?? helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
