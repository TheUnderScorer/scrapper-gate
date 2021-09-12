import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { SnackbarVariant } from '../types';

export const useSnackbarOnError = () => {
  const snackbar = useSnackbar();

  return useCallback(
    (error: Error) => {
      snackbar.enqueueSnackbar({
        message: error.message,
        variant: SnackbarVariant.Error,
        title: error.name,
        persist: false,
        preventDuplicate: true,
        key: 'error',
      });
    },
    [snackbar]
  );
};
