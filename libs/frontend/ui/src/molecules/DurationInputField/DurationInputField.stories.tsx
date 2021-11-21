import { DurationInputFieldProps } from './DurationInputField.types';
import { Duration } from '@scrapper-gate/shared/common';
import { Meta } from '@storybook/react';
import { useState } from 'react';
import 'reflect-metadata';
import { DurationInputField as Field } from './DurationInputField';

export default {
  title: 'Molecules/DurationInputField',
  argTypes: {
    label: {
      control: 'text',
    },
  },
  component: Field,
} as Meta;

export const DurationInputField = (
  args: Pick<DurationInputFieldProps, 'label'>
) => {
  const [value, setValue] = useState(Duration.fromMinutes(60).toInput());

  return (
    <>
      <Field {...args} name="duration" value={value} onChange={setValue} />
      <pre>{JSON.stringify(value, null, ' ')}</pre>
    </>
  );
};

DurationInputField.args = {
  label: 'Duration',
};
