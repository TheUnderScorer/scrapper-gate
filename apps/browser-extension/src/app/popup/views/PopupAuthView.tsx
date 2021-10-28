import React from 'react';
import { Auth } from '@scrapper-gate/frontend/domain/auth';
import { Box } from '@mui/material';
import { useTokensStore } from '../../auth/useTokensStore';

export const PopupAuthView = () => {
  return (
    <Box paddingBottom={4} height="auto" width="450px">
      <Auth useTokensStore={useTokensStore} />
    </Box>
  );
};
