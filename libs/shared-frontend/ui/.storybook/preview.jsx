import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { ThemeProvider } from '../../theme/src';
import { SnackbarProvider } from 'notistack';
import React from 'react';

addDecorator(withKnobs);

addDecorator((storyFn) => {
  console.log('Preview:', storyFn);
  return (
    <ThemeProvider>
      <SnackbarProvider>{storyFn()}</SnackbarProvider>
    </ThemeProvider>
  );
});
