import { useCallback } from 'react';
import { useDialog } from '../DialogController';
import {
  ConfirmationDialog,
  confirmationDialogId,
  ConfirmationDialogProps,
} from './ConfirmationDialog';

export const useConfirmationDialog = ({
  title,
  message,
}: Omit<ConfirmationDialogProps, 'onConfirm' | 'onCancel'>) => {
  const { push } = useDialog();

  return useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        push({
          id: confirmationDialogId,
          content: (
            <ConfirmationDialog
              message={message}
              title={title}
              onConfirm={() => resolve(true)}
              onCancel={() => resolve(false)}
            />
          ),
        });
      }),
    [message, push, title]
  );
};
