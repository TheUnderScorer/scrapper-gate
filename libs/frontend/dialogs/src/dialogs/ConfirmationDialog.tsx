import { Button } from '@material-ui/core';
import React, { ReactNode, useCallback } from 'react';
import { useDialog } from '../DialogController';
import { Dialog } from './Dialog';

export interface ConfirmationDialogProps {
  onConfirm?: () => unknown;
  onCancel?: () => unknown;
  title?: ReactNode;
  message: ReactNode;
}

export const confirmationDialogId = 'CONFIRM';

export const ConfirmationDialog = ({
  onConfirm,
  onCancel,
  message,
  title,
}: ConfirmationDialogProps) => {
  const { pull } = useDialog();

  const handleClose = useCallback(() => {
    onCancel?.();

    pull(confirmationDialogId);
  }, [onCancel, pull]);

  return (
    <Dialog
      id={confirmationDialogId}
      onClose={handleClose}
      actions={
        <Button
          id="confirm"
          onClick={() => {
            onConfirm?.();

            pull(confirmationDialogId);
          }}
          variant="contained"
        >
          Confirm
        </Button>
      }
      title={title ?? 'Confirm action'}
    >
      {message}
    </Dialog>
  );
};
