import { Box, Button } from '@material-ui/core';
import { LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import React from 'react';
import { Form } from 'react-final-form';
import { VariablesProvider } from '../../providers/VariablesProvider';
import { VariablesDateField } from './VariablesDateField';

export default {
  title: 'Variables Date Field',
};

const variables: Variable[] = [
  createVariable({
    key: 'Myvariable',
    value: 'Variable test',
    defaultValue: 'Test',
    scope: VariableScope.Global,
  }),
  createVariable({
    key: 'Date',
    defaultValue: new Date().toISOString(),
    scope: VariableScope.Global,
    type: VariableType.Date,
  }),
];

export const Component = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Form
        initialValues={{
          variables,
          date: '{{Date}}',
        }}
        onSubmit={console.log}
        render={(props) => (
          <form onSubmit={props.handleSubmit}>
            <VariablesProvider name="variables">
              <VariablesDateField name="date" />
              <Box mt={2}>
                <pre>{JSON.stringify(props.values, null, ' ')}</pre>
              </Box>
              <Button type="submit">Submit</Button>
            </VariablesProvider>
          </form>
        )}
      />
    </LocalizationProvider>
  );
};
