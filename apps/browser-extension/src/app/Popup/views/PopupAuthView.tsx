import React from 'react';
import { Auth } from '@scrapper-gate/shared-frontend/domain/auth';
import { Box } from '@material-ui/core';

export const PopupAuthView = () => {
  return (
    <Box paddingBottom={4} height="auto" width="450px">
      <Auth />
    </Box>
  );
};
