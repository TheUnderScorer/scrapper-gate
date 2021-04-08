import React from 'react';
import { Centered } from '@scrapper-gate/shared-frontend/ui';
import { Box, Divider, Stack } from '@material-ui/core';
import { AuthFacebookButton } from './FacebookButton/AuthFacebookButton';
import { AuthGoogleButton } from './GoogleButton/AuthGoogleButton';
import { LoginForm, LoginFormProps } from '../LoginForm/LoginForm';

export interface AuthProps extends LoginFormProps {
  imageSrc?: string;
  imageClassName?: string;
  btnSectionWidth?: string;
}

export const Auth = ({
  btnSectionWidth,
  imageClassName,
  imageSrc,
  afterLogin,
}: AuthProps) => {
  return (
    <Centered>
      {imageSrc && (
        <img alt="Login" src={imageSrc} className={imageClassName} />
      )}
      <Box width={btnSectionWidth}>
        <Stack direction="column" spacing={2}>
          <LoginForm afterLogin={afterLogin} />
          <Divider variant="fullWidth" />
          <AuthFacebookButton />
          <AuthGoogleButton />
        </Stack>
      </Box>
    </Centered>
  );
};
