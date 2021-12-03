import {
  Box,
  BoxProps,
  Paper,
  PaperProps,
  TextFieldProps,
} from '@mui/material';
import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Key } from 'ts-key-enum';

export interface SelectablePaperProps
  extends ThemedSxProps,
    Pick<TextFieldProps, 'error'> {
  checked?: boolean;
  disabled?: boolean;
  onSelect?: () => unknown;
  width?: number | string;
  height?: number | string;
  className?: string;
  children?: ReactNode;
  boxProps?: BoxProps;
  paperProps?: PaperProps;
  checkedBackgroundColor?: 'lightPrimary' | 'primary';
}

export const SelectablePaper = ({
  children,
  disabled,
  checked,
  onSelect,
  height = '100px',
  width = '100px',
  className,
  boxProps,
  paperProps,
  checkedBackgroundColor,
  error,
}: SelectablePaperProps) => {
  return (
    <Box width={width} height={height} className={className} {...boxProps}>
      <Paper
        {...paperProps}
        tabIndex={0}
        role="radio"
        onClick={disabled ? undefined : onSelect}
        onKeyDown={(event) => {
          if ([Key.Enter, ' '].includes(event.key as Key)) {
            onSelect?.();
          }
        }}
        className={classNames(
          {
            checked,
            disabled,
          },
          'selectable-paper',
          paperProps?.className
        )}
        variant="outlined"
        sx={{
          transition: (theme) => theme.transitions.create('all'),
          width: '100%',
          height: '100%',
          borderRadius: (theme) => theme.shape.borderRadius,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: (theme) =>
            error ? theme.palette.error.main : undefined,

          '&.disabled': {
            backgroundColor: (theme) => theme.palette.action.disabledBackground,
            cursor: 'not-allowed',
          },

          '& .MuiGrid': {
            width: '100%',
            height: '100%',
          },

          '&.checked': {
            backgroundColor: (theme) =>
              checkedBackgroundColor === 'primary'
                ? theme.palette.primary.main
                : theme.palette.primary.light,
            borderColor: (theme) =>
              checkedBackgroundColor === 'primary'
                ? undefined
                : theme.palette.primary.dark,
            color: (theme) =>
              checkedBackgroundColor === 'primary'
                ? theme.palette.primary.contrastText
                : undefined,

            '& .MuiTypography-root:not(.no-bold)': {
              fontWeight: (theme) => theme.typography.fontWeightBold,
            },
          },
          ...paperProps?.sx,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};
