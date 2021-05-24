import { Stack, TextField, Typography } from '@material-ui/core';
import {
  createVariable,
  resolveVariables,
} from '@scrapper-gate/shared/domain/variables';
import { Variable, VariableScope } from '@scrapper-gate/shared/schema';
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
    scope: VariableScope.Global,
  }),
  createVariable({
    key: 'Testvar',
    defaultValue: 'Def',
    scope: VariableScope.Global,
  }),
  createVariable({
    key: 'Longvariablename',
    defaultValue: 'Default',
    scope: VariableScope.Scrapper,
  }),
];

export const Component = () => {
  return (
    <Form
      initialValues={{
        variables,
      }}
      onSubmit={console.log}
      render={(props) => (
        <VariablesProvider name="variables">
          <Stack spacing={2}>
            <VariablesTextField label="Variable" name="variable" />
            <VariablesTextField label="Variable" name="variable1" />
            <TextField label="Text field" />
            <Typography>Values:</Typography>
            <pre>{JSON.stringify(props.values, null, ' ')}</pre>
            <Typography>Resolved variables:</Typography>
            <pre>
              {JSON.stringify(
                resolveVariables(props.values, variables),
                null,
                ' '
              )}
            </pre>
          </Stack>
        </VariablesProvider>
      )}
    />
  );
};
