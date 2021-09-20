import { Alert, Fade } from '@mui/material';
import Box from '@mui/material/Box';
import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import { Perhaps } from '@scrapper-gate/shared/common';

import React, { useCallback, useEffect, useState } from 'react';

export interface ErrorAlertProps extends ThemedSxProps {
  /**
   * Error to display in alert
   * */
  error?: Perhaps<Error>;
  onClose?: () => void;
  className?: string;
}

export const ErrorAlert = ({
  error,
  onClose,
  className,
  sx,
}: ErrorAlertProps) => {
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
      <Box className={className} sx={sx}>
        {currentError && (
          <Alert
            onClose={handleClose}
            className="error-alert"
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
