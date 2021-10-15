import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import React from 'react';
import { ScrapperRunSettingsForm } from '../../ScrapperRunSettingsForm/ScrapperRunSettingsForm';

export const ScrapperBuilderSettings = () => {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        padding: (theme) => theme.spacing(2),
      }}
    >
      <Card>
        <CardHeader title="Run settings" />
        <CardContent>
          <ScrapperRunSettingsForm
            getFieldName={(name) => `runSettings.${name}`}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};
