import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectProps,
  TextFieldProps,
  useTheme,
} from '@mui/material';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { Emoji } from '@scrapper-gate/frontend/ui';
import React, { Children, PropsWithChildren, useMemo } from 'react';
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
      | 'disabled'
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
