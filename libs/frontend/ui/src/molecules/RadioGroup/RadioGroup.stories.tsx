import { Description, Home } from '@mui/icons-material';
import React from 'react';
import { Form } from 'react-final-form';
import { action } from '@storybook/addon-actions';
import { RadioGroup } from './RadioGroup';
import { Selection } from '@scrapper-gate/frontend/common';

export default {
  title: 'UI/Radio Group',
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
          <RadioGroup label="Test value" name="test" options={options} />
          <div>
            <pre>Values: {JSON.stringify(values, null, ' ')}</pre>
          </div>
        </div>
      )}
    />
  );
};
