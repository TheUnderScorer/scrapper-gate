import { Stack } from '@material-ui/core';
import {
  CancelButton,
  SimpleDialog,
  SimpleDialogProps,
} from '@scrapper-gate/frontend/ui';
import { PropsWithChildren, ReactNode } from 'react';
import { BaseDialogProps, DialogProperties } from '../types';
import { useDialogMethods } from '../useDialogMethods';

export interface DialogProps
  extends BaseDialogProps,
    Omit<SimpleDialogProps, 'open'>,
    Pick<DialogProperties, 'id'> {
  cancelLabel?: ReactNode;
}

export const Dialog = ({
  id,
  children,
  onCancel,
  actions,
  cancelLabel = 'Cancel',
  ...props
}: PropsWithChildren<DialogProps>) => {
  const { cancel } = useDialogMethods({
    id,
    onCancel,
  });

  return (
    <SimpleDialog
      {...props}
      onClose={cancel}
      open
      actions={
        <Stack direction="row" spacing={1}>
          <CancelButton onClick={cancel}>{cancelLabel}</CancelButton>
          {actions}
        </Stack>
      }
    >
      {children}
    </SimpleDialog>
  );
};
