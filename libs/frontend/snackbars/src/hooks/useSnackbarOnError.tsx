import { useSnackbar } from 'notistack';
import { useTheme } from '@material-ui/core';
import { useCallback } from 'react';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { makeStyles } from '@material-ui/core/styles';
import { Emoji } from '@scrapper-gate/frontend/ui';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

export const useSnackbarOnError = () => {
  const snackbar = useSnackbar();
  const theme = useTheme() as AppTheme;

  const classes = useStyles();

  return useCallback(
    (error: Error) => {
      snackbar.enqueueSnackbar(
        <>
          {error.message}
          <Emoji>{theme.emojis.error}</Emoji>
        </>,
        {
          title: error.name,
          className: classes.snackbar,
          persist: false,
        }
      );
    },
    [classes.snackbar, snackbar, theme.emojis.error]
  );
};
