import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useSnackbarOnError = () => {
  const snackbar = useSnackbar();

  return useCallback(
    (error: Error) => {
      snackbar.enqueueSnackbar(error.message, {
        variant: 'error',
        title: error.name,
      });
    },
    [snackbar]
  );
};
