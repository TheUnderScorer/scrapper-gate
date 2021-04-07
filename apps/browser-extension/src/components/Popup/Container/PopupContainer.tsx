import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Property } from 'csstype';
import { Container } from '@material-ui/core';
import classNames from 'classnames';

export type PopupContainerProps = {
  backgroundColor?: Property.BackgroundColor;
  height?: Property.Height;
  width?: Property.Width;
};

const useStyles = makeStyles(() => ({
  container: ({
    height,
    backgroundColor,
    width = '500px',
  }: PopupContainerProps) => ({
    '&.MuiContainer-root': {
      width,
      height,
      backgroundColor,
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
