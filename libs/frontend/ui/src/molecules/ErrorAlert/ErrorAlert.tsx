import { Alert, Fade } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Perhaps } from '@scrapper-gate/shared/common';
import classNames from 'classnames';

import React, { useCallback, useEffect, useState } from 'react';

const PREFIX = 'ErrorAlert';

const classes = {
  alert: `${PREFIX}-alert`,
};

const StyledFade = styled(Fade)(({ theme }) => ({
  [`& .${classes.alert}`]: {
    '&.MuiPaper-root': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  },
}));

export interface ErrorAlertProps {
  /**
   * Error to display in alert
   * */
  error?: Perhaps<Error>;
  onClose?: () => void;
  className?: string;
}

export const ErrorAlert = ({ error, onClose, className }: ErrorAlertProps) => {
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
    <StyledFade timeout={1000} in={Boolean(currentError)}>
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
    </StyledFade>
  );
};
