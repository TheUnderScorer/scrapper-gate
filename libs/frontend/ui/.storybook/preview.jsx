/*eslint-disable*/
import { ThemeProvider } from '../../theme/src';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import React from 'react';

export const decorators = [
  (storyFn) => {
    return (
      <ThemeProvider EmotionThemeProvider={EmotionThemeProvider}>
        {storyFn()}
      </ThemeProvider>
    );
  },
];
