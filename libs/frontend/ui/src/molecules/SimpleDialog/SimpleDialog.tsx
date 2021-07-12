import React, { FC, ReactNode } from 'react';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Centered } from '../../atoms/Centered/Centered';

export interface SimpleDialogProps
  extends Pick<DialogProps, 'maxWidth' | 'fullWidth' | 'PaperProps'> {
  title: ReactNode;
  actions?: ReactNode;
  open?: boolean;
  onClose?: () => unknown;
  loading?: boolean;
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
  loading,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Dialog className={classes.dialog} open={open} onClose={onClose} {...props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
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
    </Dialog>
  );
};
