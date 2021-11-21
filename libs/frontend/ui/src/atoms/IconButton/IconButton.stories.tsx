import * as Icons from '@mui/icons-material';
import { IconButton as Btn, IconButtonProps } from '@mui/material';
import { Meta } from '@storybook/react';
import * as faker from 'faker';

const Icon = faker.random.objectElement(Icons);

export default {
  component: Btn,
  title: 'Atoms/IconButton',
  argTypes: {
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
        'primaryLight',
      ],
    },
  },
} as Meta;

export const IconButton = (args: IconButtonProps) => {
  return (
    <Btn {...args}>
      <Icon />
    </Btn>
  );
};
