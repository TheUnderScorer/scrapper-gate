import { Stack } from '@material-ui/core';
import { useDialogMethods } from '@scrapper-gate/frontend/dialogs';
import { PropsWithChildren } from 'react';
import { BaseDialogProps, DialogProperties } from '../types';
import {
  CancelButton,
  SimpleDialog,
  SimpleDialogProps,
} from '@scrapper-gate/frontend/ui';

export interface DialogProps
  extends BaseDialogProps,
    Omit<SimpleDialogProps, 'open'>,
    Pick<DialogProperties, 'id'> {}

export const Dialog = ({
  id,
  children,
  onCancel,
  actions,
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
          <CancelButton onClick={cancel}>Cancel</CancelButton>
          {actions}
        </Stack>
      }
    >
      {children}
    </SimpleDialog>
  );
};
