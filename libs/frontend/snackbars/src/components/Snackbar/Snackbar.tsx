import {
  Alert,
  AlertColor,
  IconButton,
  Snackbar as BaseSnackbar,
  Stack,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { Emoji } from '@scrapper-gate/frontend/ui';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { useTimeoutFn } from 'react-use';
import { SnackbarVariant } from '../../types';
import { SnackbarProps } from './Snackbar.types';

const severityMap: {
  [Key in SnackbarVariant]?: AlertColor;
} = {
  [SnackbarVariant.Success]: 'success',
  [SnackbarVariant.Error]: 'error',
  [SnackbarVariant.Info]: 'info',
};

const useStyles = makeStyles((theme) => ({
  emoji: {
    '& img': {
      width: `${theme.typography.h6.fontSize} !important`,
      height: `${theme.typography.h6.fontSize} !important`,
    },
  },
  alert: {
    minWidth: theme.spacing(10),

    '& .MuiAlert-icon': {
      padding: 0,
    },
  },
  snackbar: {
    pointerEvents: 'all',

    '& .MuiPaper-root': {
      display: 'flex',
      alignItems: 'center',
    },
  },
}));

export const Snackbar = ({
  variant,
  message,
  action,
  ...rest
}: SnackbarProps) => {
  const [open, setOpen] = useState(true);

  const classes = useStyles();

  const theme = useTheme();

  const emoji = useMemo(() => {
    const map: {
      [Key in SnackbarVariant]?: string;
    } = {
      [SnackbarVariant.Error]: theme.emojis.error,
      [SnackbarVariant.Success]: theme.emojis.success,
    };

    return map[variant];
  }, [theme.emojis.error, theme.emojis.success, variant]);

  useTimeoutFn(() => setOpen(false), rest.autoHideDuration ?? 5000);

  return (
    <BaseSnackbar
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      {...rest}
      className={classNames(rest.className, classes.snackbar)}
    >
      <Alert
        elevation={3}
        className={classes.alert}
        severity={severityMap[variant]}
        variant="filled"
        icon={<Emoji className={classes.emoji}>{emoji}</Emoji>}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>{message}</Typography>
          <IconButton color="inherit" onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Stack>
      </Alert>
    </BaseSnackbar>
  );
};
