import React, { useMemo } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { ConditionalRules } from './ConditionalRules';
import { makeHtmlElementRule } from '../../rules/htmlRule';
import { dateRule } from '../../rules/dateRule';

export default {
  title: 'Conditional Rules',
};

export const Component = () => {
  const rules = useMemo(
    () => [
      dateRule,
      makeHtmlElementRule({
        highlightId: 'highlight',
      }),
    ],
    []
  );

  return (
    <Form
      onSubmit={console.log}
      render={() => (
        <form>
          <ConditionalRules
            helperText="Configure rules that happen when various stuff happens."
            label="Rules"
            definitions={rules}
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
