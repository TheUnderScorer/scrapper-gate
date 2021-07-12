import { Button, ButtonGroup } from '@material-ui/core';
import { useDialog } from '@scrapper-gate/frontend/dialogs';
import { CancelButton, SimpleDialog } from '@scrapper-gate/frontend/ui';
import React, { ReactNode, useCallback } from 'react';

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
    <SimpleDialog
      open
      onClose={handleClose}
      actions={
        <ButtonGroup>
          <CancelButton onClick={handleClose}>Cancel</CancelButton>
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
        </ButtonGroup>
      }
      title={title ?? 'Confirm action'}
    >
      {message}
    </SimpleDialog>
  );
};
