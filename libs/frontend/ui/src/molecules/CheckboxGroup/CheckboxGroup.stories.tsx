import { Form } from 'react-final-form';
import React from 'react';
import { Home, Description } from '@material-ui/icons';
import { action } from '@storybook/addon-actions';
import { Box } from '@material-ui/core';
import { CheckboxGroup } from './CheckboxGroup';
import { Selection } from '@scrapper-gate/frontend/common';

export default {
  title: 'UI/Checkbox Group',
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
  return (
    <Form
      onSubmit={action('submit')}
      render={({ values }) => (
        <div>
          <CheckboxGroup
            spacing={2}
            label="Test value"
            name="test"
            options={options}
          />
          <Box mt={6}>
            <pre>Values: {JSON.stringify(values, null, ' ')}</pre>
          </Box>
        </div>
      )}
    />
  );
};
