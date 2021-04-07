import React, { useCallback, useEffect, useState } from 'react';
import { Fade } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

export interface ErrorAlertProps {
  error?: Error;
  onClose?: () => void;
}

const useStyles = makeStyles((theme) => ({
  alert: {
    '&.MuiPaper-root': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  },
}));

export const ErrorAlert = ({ error, onClose }: ErrorAlertProps) => {
  const classes = useStyles();

  const [currentError, setCurrentError] = useState(error);

  useEffect(() => {
    setCurrentError(error);
  }, [error]);

  const handleClose = useCallback(() => {
    setCurrentError(null);

    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Fade timeout={1000} in={Boolean(currentError)}>
      <div>
        {currentError && (
          <Box mb={3}>
            <Alert
              onClose={handleClose}
              className={classes.alert}
              variant="filled"
              severity="error"
            >
              {error?.message ?? 'Unknown error occurred.'}
            </Alert>
          </Box>
        )}
      </div>
    </Fade>
  );
};
