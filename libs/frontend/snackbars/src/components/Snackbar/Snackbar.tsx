import { Close } from '@mui/icons-material';
import {
  Alert,
  AlertColor,
  IconButton,
  Snackbar as BaseSnackbar,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Emoji } from '@scrapper-gate/frontend/ui';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { useTimeoutFn } from 'react-use';
import { SnackbarVariant } from '../../types';
import { SnackbarProps } from './Snackbar.types';

const PREFIX = 'Snackbar';

const classes = {
  emoji: `${PREFIX}-emoji`,
  alert: `${PREFIX}-alert`,
  snackbar: `${PREFIX}-snackbar`,
};

const StyledBaseSnackbar = styled(BaseSnackbar)(({ theme }) => ({
  [`& .${classes.emoji}`]: {
    '& img': {
      width: `${theme.typography.h6.fontSize} !important`,
      height: `${theme.typography.h6.fontSize} !important`,
    },
  },

  [`& .${classes.alert}`]: {
    minWidth: theme.spacing(10),

    '& .MuiAlert-icon': {
      padding: 0,
    },
  },

  [`&.${classes.snackbar}`]: {
    pointerEvents: 'all',

    '& .MuiPaper-root': {
      display: 'flex',
      alignItems: 'center',
    },
  },
}));

const severityMap: {
  [Key in SnackbarVariant]?: AlertColor;
} = {
  [SnackbarVariant.Success]: 'success',
  [SnackbarVariant.Error]: 'error',
  [SnackbarVariant.Info]: 'info',
};

export const Snackbar = ({
  variant,
  message,
  action,
  ...rest
}: SnackbarProps) => {
  const [open, setOpen] = useState(true);

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
    <StyledBaseSnackbar
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
          <IconButton
            color="inherit"
            onClick={() => setOpen(false)}
            size="large"
          >
            <Close />
          </IconButton>
        </Stack>
      </Alert>
    </StyledBaseSnackbar>
  );
};
