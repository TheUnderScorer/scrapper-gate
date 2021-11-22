import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextFieldProps,
  useTheme,
} from '@mui/material';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { Emoji, Select, SelectProps } from '@scrapper-gate/frontend/ui';
import React, { Children, PropsWithChildren, useMemo } from 'react';
import { useField } from 'react-final-form';
import { useToggle } from 'react-use';

export interface FormSelectProps<T>
  extends Pick<
      SelectProps<T>,
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
      | 'disabled'
      | 'renderValue'
      | 'chip'
    >,
    Pick<TextFieldProps, 'label' | 'helperText' | 'sx'> {
  name: string;
  initialOpen?: boolean;
}

export const FormSelect = <T extends unknown>({
  label,
  name,
  defaultValue,
  variant,
  children,
  multiple,
  helperText,
  initialOpen,
  ...props
}: PropsWithChildren<FormSelectProps<T>>) => {
  const theme = useTheme() as AppTheme;

  const [open, toggleOpen] = useToggle(Boolean(initialOpen));

  const {
    input,
    meta: { error },
  } = useField(name, {
    multiple,
    initialValue: defaultValue,
  });

  const childrenCount = useMemo(() => Children.count(children), [children]);

  return (
    <FormControl
      id={name}
      variant={variant === 'plain' ? 'outlined' : variant}
      error={Boolean(error)}
    >
      {label && <InputLabel htmlFor={name}>{label}</InputLabel>}
      <Select
        {...input}
        open={open}
        onOpen={() => toggleOpen(true)}
        onClose={() => toggleOpen(false)}
        label={label}
        multiple={multiple}
        variant={variant}
        {...props}
      >
        {childrenCount > 0 ? (
          children
        ) : (
          <MenuItem disabled>
            <ListItemIcon>
              <Emoji>{theme.emojis.empty}</Emoji>
            </ListItemIcon>
            <ListItemText>No items found</ListItemText>
          </MenuItem>
        )}
      </Select>
      {(helperText || error) && (
        <FormHelperText>{error?.message ?? helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
