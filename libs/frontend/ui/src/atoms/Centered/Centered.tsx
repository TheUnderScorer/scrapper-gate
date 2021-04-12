import { Box, BoxProps } from '@material-ui/core';
import React, { FC } from 'react';
import classNames from 'classnames';

export interface CenteredProps extends BoxProps {
  direction?: 'row' | 'column';
}

export const Centered: FC<CenteredProps> = ({
  children,
  height = '100%',
  direction,
  ...props
}) => (
  <Box
    component="div"
    display="flex"
    flex="1"
    width="100%"
    height={height}
    alignItems="center"
    justifyContent="center"
    flexDirection={direction}
    {...props}
    className={classNames('centered', props.className)}
  >
    {children}
  </Box>
);
