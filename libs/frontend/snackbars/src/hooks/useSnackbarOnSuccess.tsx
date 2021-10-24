import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { v4 } from 'uuid';
import { SnackbarVariant } from '../types';

export const useSnackbarOnSuccess = () => {
  const snackbar = useSnackbar();

  return useCallback(
    (message: string) => {
      snackbar.enqueueSnackbar(message, {
        variant: SnackbarVariant.Success,
        title: 'Success',
        persist: false,
        key: `success-${v4()}`,
      });
    },
    [snackbar]
  );
};
