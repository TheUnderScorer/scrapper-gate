import { useMemo } from 'react';
import { useDialog } from './DialogController';
import { DialogProperties, BaseDialogProps } from './types';

export interface UseDialogMethodsParams
  extends BaseDialogProps,
    Pick<DialogProperties, 'id'> {}

export const useDialogMethods = ({ id, onCancel }: UseDialogMethodsParams) => {
  const { pull } = useDialog();

  return useMemo(
    () => ({
      cancel: () => {
        onCancel?.();

        pull(id);
      },
      pull: () => pull(id),
    }),
    [id, onCancel, pull]
  );
};
