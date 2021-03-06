/*eslint-disable*/
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';
import { ThemeProvider } from '../../theme/src';
import { SnackbarProvider } from '../../snackbars/src/providers/SnackbarProvider';
import React from 'react';

addDecorator(withKnobs);

addDecorator(withActions);

addDecorator((storyFn) => {
  return (
    <ThemeProvider>
      <SnackbarProvider>{storyFn()}</SnackbarProvider>
    </ThemeProvider>
  );
});
