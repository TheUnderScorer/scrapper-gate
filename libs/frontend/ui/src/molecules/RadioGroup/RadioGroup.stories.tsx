import { Description, Home } from '@mui/icons-material';
import { Selection } from '@scrapper-gate/frontend/common';
import { Meta } from '@storybook/react';
import React, { useState } from 'react';
import { RadioGroup as Component, RadioGroupProps } from './RadioGroup';

export default {
  title: 'Molecules/Radio Group',
  component: Component,
  args: {
    label: 'Test value',
    name: 'test',
  },
} as Meta;

const options: Selection[] = [
  {
    label: 'Value 1',
    value: 'value_1',
    icon: <Home />,
  },
  {
    label: 'Value 2',
    value: 'value_2',
    icon: <Description />,
  },
];

export const RadioGroup = (
  args: Omit<RadioGroupProps<string>, 'value' | 'onChange' | 'options'>
) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <div>
      <Component
        value={value}
        onChange={setValue}
        options={options}
        {...args}
      />
    </div>
  );
};
