/*eslint-disable*/
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

import { SnackbarProvider } from 'notistack';
import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ThemeProvider } from '../../../theme/src';

addDecorator(withKnobs);

addDecorator(withActions);

addDecorator((storyFn) => {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {storyFn()}
        </MuiPickersUtilsProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
});
