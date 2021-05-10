import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import {
  baseRulesSelection,
  ConditionalRules,
} from '@scrapper-gate/frontend/domain/conditional-rules';

export default {
  title: 'Conditional Rules',
};

export const Component = () => {
  return (
    <Form
      onSubmit={console.log}
      render={() => (
        <form>
          <ConditionalRules
            helperText="Configure rules that happen when various stuff happens."
            label="Rules"
            fieldVariant="outlined"
            definitions={baseRulesSelection}
            name="conditionalRules"
          />
          <FormSpy
            render={(props) => (
              <pre>{JSON.stringify(props.values, null, ' ')}</pre>
            )}
          />
        </form>
      )}
    />
  );
};
