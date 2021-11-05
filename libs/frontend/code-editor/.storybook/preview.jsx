/*eslint-disable*/
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '../../theme/src';
import React from 'react';

addDecorator((storyFn) => {
  return <ThemeProvider>{storyFn()}</ThemeProvider>;
});
