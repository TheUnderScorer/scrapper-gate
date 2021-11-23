import { Button as Btn, ButtonProps } from '@mui/material';
import { Meta } from '@storybook/react';

export default {
  component: Btn,
  title: 'Atoms/Button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'outlined', 'contained'],
    },
    color: {
      control: 'select',
      options: [
        'inherit',
        'primary',
        'secondary',
        'success',
        'error',
        'info',
        'warning',
      ],
    },
  },
} as Meta;

export const Button = (args: ButtonProps) => {
  return <Btn {...args}>Button</Btn>;
};
