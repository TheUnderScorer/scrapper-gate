import { Box } from '@material-ui/core';
import { LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { VariableScope } from '@scrapper-gate/shared/schema';
import React from 'react';
import { Form } from 'react-final-form';
import { VariablesProvider } from '../../providers/VariablesProvider';
import { VariablesTextField } from '../VariablesTextField/VariablesTextField';
import { VariablesTable } from './VariablesTable';

export default {
  title: 'Variables Table',
};

export const Component = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Form
        onSubmit={console.log}
        initialValues={{
          variables: [],
        }}
        render={(props) => (
          <VariablesProvider name="variables">
            <Box width="100%" height="400px">
              <VariablesTable scope={VariableScope.Global} name="variables" />
              <VariablesTextField name="variable" />
              <pre>{JSON.stringify(props.values, null, ' ')}</pre>
            </Box>
          </VariablesProvider>
        )}
      />
    </LocalizationProvider>
  );
};
