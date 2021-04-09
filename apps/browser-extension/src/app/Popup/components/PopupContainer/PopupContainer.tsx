import React, { PropsWithChildren } from 'react';
import { CSSProperties, makeStyles } from '@material-ui/styles';
import { BoxProps, Container } from '@material-ui/core';
import classNames from 'classnames';

export type PopupContainerProps = BoxProps;

const useStyles = makeStyles(() => ({
  container: ({ width = '500px', ...rest }: PopupContainerProps) => ({
    '&.MuiContainer-root': {
      width,
      ...(rest as CSSProperties),
    },
  }),
}));

export const PopupContainer = (
  props: PropsWithChildren<PopupContainerProps>
) => {
  const classes = useStyles(props);

  return (
    <Container className={classNames(classes.container, 'popup-container')}>
      {props.children}
    </Container>
  );
};
