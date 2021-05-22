import { Box, TextField, Typography } from '@material-ui/core';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import { Variable } from '@scrapper-gate/shared/schema';
import React from 'react';
import { Form } from 'react-final-form';
import { VariablesProvider } from '../../providers/VariablesProvider';
import { VariablesTextField } from './VariablesTextField';

export default {
  title: 'Variables Text Field',
};

const variables: Variable[] = [
  createVariable({
    key: 'Myvariable',
    value: 'Variable test',
    defaultValue: 'Test',
  }),
  createVariable({
    key: 'Testvar',
    defaultValue: 'Def',
  }),
];

export const Component = () => {
  return (
    <Form
      initialValues={{
        variables,
      }}
      onSubmit={console.log}
      render={() => (
        <VariablesProvider name="variables">
          <Box mb={4}>
            <Typography variant="h4">Variables text field</Typography>
          </Box>
          <VariablesTextField label="Variable" name="variable" />
          <VariablesTextField label="Variable" name="variable1" />
          <TextField label="Text field" />
        </VariablesProvider>
      )}
    />
  );
};
