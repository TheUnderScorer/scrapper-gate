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
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FormFieldProps } from '../../types';

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
    Pick<TextFieldProps, 'label' | 'helperText' | 'sx'>,
    FormFieldProps<T> {
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
  fieldProps,
  ...props
}: PropsWithChildren<FormSelectProps<T>>) => {
  const theme = useTheme() as AppTheme;

  const [open, toggleOpen] = useToggle(Boolean(initialOpen));

  const { input, meta } = useField(name, {
    multiple,
    initialValue: defaultValue,
    ...fieldProps,
  });

  const { error } = meta;

  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  const childrenCount = useMemo(() => Children.count(children), [children]);

  return (
    <FormControl
      id={name}
      variant={variant === 'plain' ? 'outlined' : variant}
      error={hasError}
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
      {(helperText || hasError) && (
        <FormHelperText>
          {hasError ? error?.message : helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
