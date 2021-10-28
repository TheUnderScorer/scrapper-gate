import { BoxProps, Container } from '@mui/material';
import React, { PropsWithChildren } from 'react';

export type PopupContainerProps = BoxProps;

export const PopupContainer = (
  props: PropsWithChildren<PopupContainerProps>
) => {
  return (
    <Container
      className="popup-container"
      sx={{
        '&.MuiContainer-root': {
          ...props,
        },
      }}
    >
      {props.children}
    </Container>
  );
};
