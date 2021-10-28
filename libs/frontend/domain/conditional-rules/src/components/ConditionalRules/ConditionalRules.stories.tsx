import { variableRule } from '../../rules/variableRule';
import { FormVariablesProvider } from '@scrapper-gate/frontend/domain/variables';
import {
  ConditionalRuleTypes,
  ConditionalRuleWhen,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  ConditionalRuleGroupType,
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { subDays, subHours } from 'date-fns';
import React, { useMemo } from 'react';
import { Form } from 'react-final-form';
import { dateRule } from '../../rules/dateRule';
import { makeHtmlElementRule } from '../../rules/htmlRule';
import { ConditionalRules } from './ConditionalRules';

export default {
  title: 'Conditional Rules',
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
    defaultValue: subHours(subDays(new Date(), 1), 2).toISOString(),
    scope: VariableScope.Global,
    type: VariableType.Date,
  }),
];

const conditionalRules = [
  {
    type: ConditionalRuleGroupType.All,
    rules: [
      {
        value: '{{Date}}',
        when: ConditionalRuleWhen.Equals,
        type: ConditionalRuleTypes.Date,
        id: '#id',
      },
      {
        type: ConditionalRuleTypes.HtmlElement,
      },
    ],
  },
];

export const Component = () => {
  const rules = useMemo(
    () => [
      dateRule,
      makeHtmlElementRule({
        highlightId: 'highlight',
      }),
      variableRule,
    ],
    []
  );

  return (
    <Form
      initialValues={{
        variables,
        conditionalRules,
      }}
      onSubmit={console.log}
      render={(props) => (
        <FormVariablesProvider name="variables">
          <form>
            <ConditionalRules
              fieldVariant="outlined"
              helperText="Configure rules that happen when various stuff happens."
              label="Rules"
              definitions={rules}
              name="conditionalRules"
            />
            <pre>{JSON.stringify(props.values, null, ' ')}</pre>
          </form>
        </FormVariablesProvider>
      )}
    />
  );
};
