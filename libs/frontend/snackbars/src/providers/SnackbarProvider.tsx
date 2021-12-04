import { Box, Grow, useTheme } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { SnackbarProvider as Provider, SnackbarProviderProps } from 'notistack';
import { ComponentType, PropsWithChildren } from 'react';

const IconWrapper = (props: PropsWithChildren<unknown>) => (
  <Box
    component="span"
    mr={1}
    sx={{
      fontSize: (theme) => theme.typography.h5.fontSize,
    }}
  >
    {props.children}
  </Box>
);

export const SnackbarProvider = ({
  children,
  ...rest
}: PropsWithChildren<SnackbarProviderProps>) => {
  const theme = useTheme();

  return (
    <Provider
      {...rest}
      TransitionComponent={Grow as ComponentType<TransitionProps>}
      iconVariant={{
        error: <IconWrapper>{theme.emojis.error}</IconWrapper>,
        success: <IconWrapper>{theme.emojis.success}</IconWrapper>,
      }}
    >
      {children}
    </Provider>
  );
};
