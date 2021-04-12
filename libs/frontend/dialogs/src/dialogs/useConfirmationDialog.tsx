import { DialogProperties, useDialogStore } from '../useDialogStore';
import { useCallback } from 'react';

export interface UseConfirmationDialogProps
  extends Pick<DialogProperties, 'title' | 'content'> {
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
}

export const useConfirmationDialog = ({
  onConfirm,
  title = 'Confirm action',
  content,
  confirmText = 'Confirm',
}: UseConfirmationDialogProps) => {
  const setDialog = useDialogStore((store) => store.setDialog);

  return useCallback(() => {
    setDialog({
      title,
      content,
      footerButtons: ({ handleClose, setLoading }) => [
        {
          children: 'Cancel',
          onClick: handleClose,
        },
        {
          children: confirmText,
          id: 'confirm',
          onClick: async () => {
            setLoading(true);

            await onConfirm?.();

            setLoading(false);
            handleClose();
          },
        },
      ],
    });
  }, [confirmText, content, onConfirm, setDialog, title]);
};
