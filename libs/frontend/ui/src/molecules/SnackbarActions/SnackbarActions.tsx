import React from 'react';
import { SnackbarKey, useSnackbar } from 'notistack';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

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
