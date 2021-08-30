import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { SnackbarKey, useSnackbar } from 'notistack';
import React from 'react';

export interface SnackbarActionsProps {
  key: SnackbarKey;
}

const useStyles = makeStyles({
  item: {
    pointerEvents: 'all',
  },
});

export const SnackbarActions = ({ key }: SnackbarActionsProps) => {
  const { closeSnackbar } = useSnackbar();

  const classes = useStyles();

  return (
    <IconButton
      color="inherit"
      className={classes.item}
      onClick={() => closeSnackbar(key)}
    >
      <Close />
    </IconButton>
  );
};
