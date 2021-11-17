/*eslint-disable*/
import { ThemeProvider } from '../../theme/src';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import React from 'react';

export const decorators = [
  (Story) => {
    return (
      <ThemeProvider EmotionThemeProvider={EmotionThemeProvider}>
        <Story />
      </ThemeProvider>
    );
  },
];
