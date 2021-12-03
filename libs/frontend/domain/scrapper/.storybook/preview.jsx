/*eslint-disable*/
import { ThemeProvider } from '../../../theme/src';
import { SnackbarProvider } from '@scrapper-gate/frontend/snackbars';
import React from 'react';
import { DialogController } from '../../../dialogs/src';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';

export const decorators = [
  (storyFn) => {
    return (
      <ThemeProvider EmotionThemeProvider={EmotionThemeProvider}>
        <SnackbarProvider>
          <DialogController>{storyFn()}</DialogController>
        </SnackbarProvider>
      </ThemeProvider>
    );
  },
];
