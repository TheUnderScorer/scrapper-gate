import { Box, BoxProps, Paper, PaperProps } from '@mui/material';
import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import classNames from 'classnames';
import React, { MouseEventHandler, ReactNode } from 'react';

export interface SelectablePaperProps extends ThemedSxProps {
  checked?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
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
  onClick,
  height = '100px',
  width = '100px',
  className,
  boxProps,
  paperProps,
  checkedBackgroundColor,
}: SelectablePaperProps) => {
  return (
    <Box width={width} height={height} className={className} {...boxProps}>
      <Paper
        {...paperProps}
        role="radio"
        onClick={disabled ? undefined : onClick}
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
