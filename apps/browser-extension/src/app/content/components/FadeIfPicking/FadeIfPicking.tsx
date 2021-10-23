import { Box } from '@mui/material';
import { useIsUsingElementPicker } from '@scrapper-gate/frontend/common';
import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

export const FadeIfPicking = ({ children }: PropsWithChildren<unknown>) => {
  const [picking] = useIsUsingElementPicker();

  return (
    <Box
      sx={{
        transition: (theme) => theme.transitions.create('opacity'),
        '&.picking': {
          opacity: 0.01,

          '&, & *': {
            userSelect: 'none',
            pointerEvents: 'none !important' as 'none',
          },
        },
      }}
      className={classNames({ picking })}
    >
      {children}
    </Box>
  );
};
