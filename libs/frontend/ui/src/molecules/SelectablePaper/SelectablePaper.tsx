import React, { MouseEventHandler, ReactNode } from 'react';
import { Box, BoxProps, Paper, PaperProps } from '@material-ui/core';
import classNames from 'classnames';
import { useStyles } from './SelectablePaper.styles';

export interface SelectablePaperProps {
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
  const classes = useStyles({ checkedBackgroundColor });

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
          classes.paper,
          paperProps?.className
        )}
        variant="outlined"
      >
        {children}
      </Paper>
    </Box>
  );
};
