/*eslint-disable*/
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '../../../theme/src';
import { SnackbarProvider } from '@scrapper-gate/frontend/snackbars';
import React from 'react';
import { DialogController } from '../../../dialogs/src';

addDecorator((storyFn) => {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <DialogController>{storyFn()}</DialogController>
      </SnackbarProvider>
    </ThemeProvider>
  );
});
