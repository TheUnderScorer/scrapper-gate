import { Fade } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { Perhaps } from '@scrapper-gate/shared/common';
import classNames from 'classnames';

import React, { useCallback, useEffect, useState } from 'react';

export interface ErrorAlertProps {
  /**
   * Error to display in alert
   * */
  error?: Perhaps<Error>;
  onClose?: () => void;
  className?: string;
}

const useStyles = makeStyles((theme) => ({
  alert: {
    '&.MuiPaper-root': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  },
}));

export const ErrorAlert = ({ error, onClose, className }: ErrorAlertProps) => {
  const classes = useStyles();

  const [currentError, setCurrentError] = useState<Perhaps<Error>>(error);

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
      <Box className={className}>
        {currentError && (
          <Alert
            onClose={handleClose}
            className={classNames(classes.alert, 'error-alert')}
            variant="filled"
            severity="error"
          >
            {error?.message ?? 'Unknown error occurred.'}
          </Alert>
        )}
      </Box>
    </Fade>
  );
};
