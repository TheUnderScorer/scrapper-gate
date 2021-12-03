import { FabProps } from '@mui/material';
import { Fab as Btn } from '@mui/material';
import * as Icons from '@mui/icons-material';
import { Meta } from '@storybook/react';
import * as faker from 'faker';

const Icon = faker.random.objectElement(Icons);

export default {
  component: Btn,
  title: 'Atoms/Fab',
  argTypes: {
    variant: {
      control: 'select',
      options: ['circular', 'extended'],
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

export const Fab = (args: FabProps) => {
  return (
    <Btn {...args}>
      <Icon />
    </Btn>
  );
};
