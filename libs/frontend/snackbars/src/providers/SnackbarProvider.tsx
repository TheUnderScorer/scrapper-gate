import { SnackbarProps } from '@material-ui/core';
import { SnackbarProvider as Provider, SnackbarProviderProps } from 'notistack';
import { PropsWithChildren } from 'react';
import { Snackbar } from '../components/Snackbar/Snackbar';
import { SnackbarVariant } from '../types';

const makeSnackbarVariant =
  (variant: SnackbarVariant) => (props: SnackbarProps) =>
    <Snackbar variant={variant} {...props} />;

const components = {
  [SnackbarVariant.Success]: makeSnackbarVariant(SnackbarVariant.Success),
  [SnackbarVariant.Error]: makeSnackbarVariant(SnackbarVariant.Error),
  [SnackbarVariant.Info]: makeSnackbarVariant(SnackbarVariant.Info),
};

export const SnackbarProvider = ({
  children,
  ...rest
}: PropsWithChildren<SnackbarProviderProps>) => {
  return (
    <Provider
      Components={components}
      {...rest}
      TransitionComponent={(props) => <div>{props.children}</div>}
    >
      {children}
    </Provider>
  );
};
