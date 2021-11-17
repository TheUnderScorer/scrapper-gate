import {
  Box,
  BoxProps,
  Checkbox,
  Fade,
  Stack,
  Typography,
} from '@mui/material';
import classNames from 'classnames';
import React, { ReactNode, useMemo } from 'react';
import {
  SelectablePaper,
  SelectablePaperProps,
} from '../SelectablePaper/SelectablePaper';

export interface TileCheckboxProps extends SelectablePaperProps {
  title?: ReactNode;
  icon?: ReactNode;
  containerProps?: BoxProps;
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
  onSelect,
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

  const text = (
    <Typography
      sx={{
        userSelect: 'none',
      }}
      variant="body2"
    >
      {title}
    </Typography>
  );

  const checkbox = (
    <Checkbox
      checked={paperProps.checked}
      disabled={paperProps.disabled}
      color="primary"
      className={classNames('tile-checkbox', direction)}
      sx={{
        '&.vertical': {
          position: 'absolute',
          top: '-12%',
          right: '-12%',
          zIndex: 2,
          pointerEvents: 'none',
        },
        '&.horizontal': {
          padding: 0,
        },
      }}
    />
  );
  return (
    <Box
      {...containerProps}
      component="div"
      sx={{
        cursor: 'pointer',
        ...containerProps?.sx,
      }}
      className={classNames(
        'tile-checkbox-container',
        containerProps?.className
      )}
      onClick={paperProps.disabled ? undefined : onSelect}
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
              sx={{
                width: '100%',
                height: '100%',
              }}
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
    </Box>
  );
};
