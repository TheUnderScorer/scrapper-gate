import { Grow } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { SnackbarProvider as Provider, SnackbarProviderProps } from 'notistack';
import { ComponentType, PropsWithChildren } from 'react';

export const SnackbarProvider = ({
  children,
  ...rest
}: PropsWithChildren<SnackbarProviderProps>) => {
  return (
    <Provider
      {...rest}
      TransitionComponent={Grow as ComponentType<TransitionProps>}
    >
      {children}
    </Provider>
  );
};
