/*eslint-disable*/
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';
import { ThemeProvider } from '../../../theme/src';
import { SnackbarProvider } from '@scrapper-gate/frontend/snackbars';
import React from 'react';
import { DialogController } from '../../../dialogs/src';

addDecorator(withKnobs);

addDecorator(withActions);

addDecorator((storyFn) => {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <DialogController>{storyFn()}</DialogController>
      </SnackbarProvider>
    </ThemeProvider>
  );
});
