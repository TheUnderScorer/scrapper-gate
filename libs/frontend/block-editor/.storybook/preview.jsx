/*eslint-disable*/
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';
import { ThemeProvider } from '../../theme/src';
import React from 'react';

addDecorator(withKnobs);

addDecorator(withActions);

addDecorator((storyFn) => {
  return <ThemeProvider>{storyFn()}</ThemeProvider>;
});
