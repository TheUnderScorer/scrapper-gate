import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import React from 'react';
import { SnackbarProvider } from '@scrapper-gate/frontend/snackbars';

addDecorator(withKnobs);

addDecorator((storyFn) => {
  return (
    <ThemeProvider>
      <SnackbarProvider>{storyFn()}</SnackbarProvider>
    </ThemeProvider>
  );
});
