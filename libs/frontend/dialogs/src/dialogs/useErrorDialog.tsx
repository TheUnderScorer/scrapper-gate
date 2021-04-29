import { AppError } from '@scrapper-gate/shared/errors';
import { useHistory } from 'react-router-dom';
import { useDialogStore } from '@scrapper-gate/frontend/dialogs';
import { useCallback } from 'react';
import { Typography } from '@material-ui/core';

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
            }
          },
        },
      ],
    });
  }, [error.message, error.name, history, onClose, setDialog]);
};
