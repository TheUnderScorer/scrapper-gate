import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { v4 } from 'uuid';
import { SnackbarVariant } from '../types';

export const useSnackbarOnError = () => {
  const snackbar = useSnackbar();

  return useCallback(
    (error: Error) => {
      snackbar.enqueueSnackbar(error.message, {
        variant: SnackbarVariant.Error,
        title: error.name,
        persist: false,
        preventDuplicate: true,
        key: `error-${v4()}`,
      });
    },
    [snackbar]
  );
};
