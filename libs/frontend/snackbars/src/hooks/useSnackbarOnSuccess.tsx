import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useTheme } from '@material-ui/core';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { makeStyles } from '@material-ui/core/styles';
import { Emoji } from '@scrapper-gate/frontend/ui';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    background: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

export const useSnackbarOnSuccess = () => {
  const snackbar = useSnackbar();
  const theme = useTheme() as AppTheme;

  const classes = useStyles();

  return useCallback(
    (message: string) => {
      snackbar.enqueueSnackbar(
        <>
          {message} <Emoji>{theme.emojis.success}</Emoji>
        </>,
        {
          className: classes.snackbar,
          title: 'Success',
          preventDuplicate: true,
          persist: false,
        }
      );
    },
    [classes.snackbar, snackbar, theme.emojis.success]
  );
};
