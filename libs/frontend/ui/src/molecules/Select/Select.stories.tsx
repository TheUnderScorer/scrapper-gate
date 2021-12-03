import { MenuItem, SelectProps } from '@mui/material';
import { Meta } from '@storybook/react';
import { Select as Component } from './Select';

export default {
  title: 'Molecules/Select',
  component: Component,
} as Meta;

export const Select = (args: SelectProps) => {
  return (
    <Component {...args} defaultValue="apple">
      <MenuItem value="apple">Apple</MenuItem>
      <MenuItem value="banana">Banana</MenuItem>
      <MenuItem value="cherry">Cherry</MenuItem>
    </Component>
  );
};
