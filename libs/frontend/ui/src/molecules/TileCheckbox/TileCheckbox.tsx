import React, { HTMLProps, ReactNode, useMemo } from 'react';
import { Box, Checkbox, Fade, Stack, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { useStyles } from './TileCheckbox.styles';
import {
  SelectablePaper,
  SelectablePaperProps,
} from '../SelectablePaper/SelectablePaper';

export interface TileCheckboxProps extends SelectablePaperProps {
  title?: ReactNode;
  icon?: ReactNode;
  containerProps?: HTMLProps<HTMLDivElement>;
  showCheckbox?: boolean;
  direction?: 'vertical' | 'horizontal';
}

const horizontalSize = {
  width: '170px',
  height: '50px',
};

const verticalSize = {
  width: '70px',
  height: '70px',
};

export const TileCheckbox = ({
  title,
  icon,
  width,
  height,
  onClick,
  children,
  containerProps,
  showCheckbox = true,
  direction = 'vertical',
  ...paperProps
}: TileCheckboxProps) => {
  const size = useMemo(() => {
    if (width && height) {
      return {
        width,
        height,
      };
    }

    return direction === 'horizontal' ? horizontalSize : verticalSize;
  }, [direction, height, width]);

  const classes = useStyles();

  const text = (
    <Typography className={classes.text} variant="body2">
      {title}
    </Typography>
  );

  const checkbox = (
    <Checkbox
      checked={paperProps.checked}
      disabled={paperProps.disabled}
      color="primary"
      className={classNames(classes.checkbox, 'tile-checkbox', direction)}
    />
  );
  return (
    <div
      {...containerProps}
      className={classNames(
        classes.container,
        'tile-checkbox-container',
        containerProps?.className
      )}
      onClick={paperProps.disabled ? undefined : onClick}
    >
      <Box position="relative" width={size.width} height={size.height}>
        {showCheckbox && direction === 'vertical' && (
          <Fade in={paperProps.checked}>{checkbox}</Fade>
        )}
        <Box width="100%" height="100%" mb={icon ? 0.5 : 0}>
          <SelectablePaper {...paperProps} width="100%" height="100%">
            <Stack
              justifyContent="center"
              alignItems="center"
              spacing={2}
              direction="row"
              className={classes.stack}
            >
              {icon}
              {direction === 'horizontal' && (
                <>
                  {text}
                  {showCheckbox && checkbox}
                </>
              )}
            </Stack>
          </SelectablePaper>
        </Box>
        {direction === 'vertical' && (
          <Box width="100%" textAlign="center">
            {text}
          </Box>
        )}
        {children}
      </Box>
    </div>
  );
};
