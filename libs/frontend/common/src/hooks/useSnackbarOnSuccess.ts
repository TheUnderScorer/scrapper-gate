import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useSnackbarOnSuccess = () => {
  const snackbar = useSnackbar();

  return useCallback(
    (message: string) => {
      snackbar.enqueueSnackbar(message, {
        variant: 'success',
        title: 'Success',
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
    },
    [snackbar]
  );
};
