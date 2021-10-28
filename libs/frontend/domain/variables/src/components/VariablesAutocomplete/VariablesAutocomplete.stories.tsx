import { Box } from '@mui/material';
import { FormVariablesProvider } from '../../providers/Form/FormVariablesProvider';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import { Variable, VariableScope } from '@scrapper-gate/shared/schema';
import { Form } from 'react-final-form';
import { VariablesAutocomplete } from './VariablesAutocomplete';

export default {
  title: 'Variables Autocomplete',
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

const options = ['Test', 'Another'];

export const Component = () => {
  return (
    <Form
      initialValues={{
        variables,
      }}
      onSubmit={console.log}
      render={() => (
        <Box width="600px">
          <FormVariablesProvider name="variables">
            <VariablesAutocomplete name="test" options={options} />
          </FormVariablesProvider>
        </Box>
      )}
    />
  );
};
