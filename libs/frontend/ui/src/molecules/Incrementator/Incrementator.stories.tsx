/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Form } from 'react-final-form';
import { Incrementator } from './Incrementator';

export default {
  title: 'Incrementator',
};

export const Component = () => {
  return (
    <Form
      onSubmit={() => {}}
      render={() => <Incrementator bottomText="Count" name="test" />}
    />
  );
};
