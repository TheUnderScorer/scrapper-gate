import React, { FC, ReactNode } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppType, useAppType } from '@scrapper-gate/shared-frontend/common';

export interface SimpleDialogProps
  extends Pick<DialogProps, 'maxWidth' | 'fullWidth' | 'PaperProps'> {
  title: ReactNode;
  actions?: ReactNode;
  open?: boolean;
  onClose?: () => unknown;
}

const useStyles = makeStyles(() => ({
  dialog: {
    '&, & *': {
      pointerEvents: 'all',
    },
  },
}));

export const SimpleDialog: FC<SimpleDialogProps> = ({
  title,
  onClose,
  actions,
  children,
  open = false,
  ...props
}) => {
  const appType = useAppType((store) => store.appType);
  const isContent = appType === AppType.ExtensionContentScript;

  const classes = useStyles();

  return (
    <Dialog
      className={classes.dialog}
      open={open}
      onClose={onClose}
      disablePortal={isContent}
      disableAutoFocus={isContent}
      {...props}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
