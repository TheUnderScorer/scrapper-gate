import { CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { PrimaryLightButton } from '@scrapper-gate/frontend/ui';
import React from 'react';
import { useCodeRunner } from '../../../hooks/useCodeRunner';
import { CodeEditorToolbarProps } from './CodeEditorToolbar.types';

export const CodeEditorToolbar = ({
  hasError,
  ...props
}: CodeEditorToolbarProps) => {
  const { run, loading, lastResult, lastError } = useCodeRunner(props);
  const theme = useTheme() as AppTheme;

  return (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <PrimaryLightButton
        startIcon={theme.icons.run}
        disabled={loading || hasError}
        onClick={run}
      >
        {loading ? <CircularProgress /> : 'Run code'}
      </PrimaryLightButton>
      {lastResult && (
        <Typography>Run result: {JSON.stringify(lastResult)}</Typography>
      )}
      {lastError && (
        <Typography color="error">Error: {lastError.message}</Typography>
      )}
    </Stack>
  );
};
