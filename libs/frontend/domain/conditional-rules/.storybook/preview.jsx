/*eslint-disable*/
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

import { SnackbarProvider } from 'notistack';
import React from 'react';
import { ThemeProvider } from '../../../theme/src';
import { LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';

addDecorator(withKnobs);

addDecorator(withActions);

addDecorator((storyFn) => {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {storyFn()}
        </LocalizationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
});
