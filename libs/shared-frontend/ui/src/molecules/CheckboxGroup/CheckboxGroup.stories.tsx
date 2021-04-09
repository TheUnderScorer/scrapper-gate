import React from 'react';
import { Description, Home } from '@material-ui/icons';
import { Box } from '@material-ui/core';
import { CheckboxGroup } from './CheckboxGroup';
import { useForm } from 'react-hook-form';
import { Selection } from '@scrapper-gate/shared-frontend/common';

export default {
  title: 'UI/Checkbox Group',
  component: CheckboxGroup,
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
  const values = form.watch();

  return (
    <div>
      <CheckboxGroup
        spacing={2}
        label="Test value"
        name="test"
        options={options}
        control={form.control}
      />
      <Box mt={6}>
        <pre>Values: {JSON.stringify(values, null, ' ')}</pre>
      </Box>
    </div>
  );
};
