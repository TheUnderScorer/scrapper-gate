import { AppError } from '@scrapper-gate/shared/errors';
import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';
import { Typography } from '@material-ui/core';
import { useDialogStore } from '../useDialogStore';

export interface UseErrorDialogProps {
  onClose?: 'goBack' | 'close';
  error: Error | AppError;
}

export const useErrorDialog = ({ error, onClose }: UseErrorDialogProps) => {
  const history = useHistory();

  const setDialog = useDialogStore((store) => store.setDialog);

  return useCallback(() => {
    setDialog({
      title: error.name ?? 'Error',
      content: <Typography>Error occurred: {error.message}</Typography>,
      footerButtons: (bag) => [
        {
          children: 'Close',
          id: 'close',
          onClick: () => {
            if (onClose === 'goBack') {
              history.goBack();

              return;
            }

            bag.handleClose();
          },
        },
      ],
    });
  }, [error.message, error.name, history, onClose, setDialog]);
};
