import { Description, Home } from '@material-ui/icons';
import React from 'react';
import { RadioGroup } from './RadioGroup';
import { useForm } from 'react-hook-form';
import { Selection } from '@scrapper-gate/frontend/common';

export default {
  title: 'UI/RadioGroup',
  component: RadioGroup,
};

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

export const Controlled = () => {
  const form = useForm();

  return (
    <div>
      <RadioGroup
        label="Test value"
        name="test"
        control={form.control}
        options={options}
      />
      <div>
        <pre>Values: {JSON.stringify(form.watch(), null, ' ')}</pre>
      </div>
    </div>
  );
};
