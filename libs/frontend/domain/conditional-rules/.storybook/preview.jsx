/*eslint-disable*/
import { SnackbarProvider } from '@scrapper-gate/frontend/snackbars';
import React from 'react';
import { ThemeProvider } from '../../../theme/src';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

export const decorators = [
  (storyFn) => {
    return (
      <ThemeProvider EmotionThemeProvider={EmotionThemeProvider}>
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {storyFn()}
          </LocalizationProvider>
        </SnackbarProvider>
      </ThemeProvider>
    );
  },
];
