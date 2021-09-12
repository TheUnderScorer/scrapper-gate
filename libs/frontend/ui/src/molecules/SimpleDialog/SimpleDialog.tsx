import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@material-ui/core';
import React, { FC, HTMLProps, ReactNode } from 'react';
import { Centered } from '../../atoms/Centered/Centered';

export interface SimpleDialogProps
  extends Pick<DialogProps, 'maxWidth' | 'fullWidth' | 'PaperProps'>,
    Pick<HTMLProps<HTMLFormElement>, 'onSubmit'> {
  title: ReactNode;
  actions?: ReactNode;
  open?: boolean;
  onClose?: () => unknown;
  loading?: boolean;
}

export const SimpleDialog: FC<SimpleDialogProps> = ({
  title,
  onClose,
  actions,
  children,
  open = false,
  loading,
  onSubmit,
  ...props
}) => {
  return (
    <Dialog open={open} onClose={onClose} {...props}>
      <form onSubmit={onSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        {(actions || loading) && (
          <DialogActions>
            {loading ? (
              <Centered>
                <CircularProgress size={30} />
              </Centered>
            ) : (
              actions
            )}
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
};
