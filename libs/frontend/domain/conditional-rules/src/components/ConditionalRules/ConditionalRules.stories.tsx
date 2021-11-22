import { FormVariablesProvider } from '@scrapper-gate/frontend/domain/variables';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  ConditionalRuleCondition,
  ConditionalRuleGroup,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
  HtmlConditionalRuleType,
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { Meta } from '@storybook/react';
import { subDays, subHours } from 'date-fns';
import React, { useMemo } from 'react';
import { Form } from 'react-final-form';
import { ConditionalRulesContextProvider } from '../../providers/ConditionalRulesContext.provider';
import { dateRule } from '../../rules/dateRule';
import { htmlRule } from '../../rules/htmlRule';
import { variableRule } from '../../rules/variableRule';
import { ConditionalRules as ConditionalRulesComponent } from './ConditionalRules';

export default {
  title: 'ConditionalRules',
  component: ConditionalRulesComponent,
} as Meta;

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

const conditionalRules: ConditionalRuleGroup[] = [
  {
    matchType: ConditionalRuleGroupMatchType.All,
    rules: [
      {
        ruleType: ConditionalRuleType.Date,
        expectedDate: new Date(),
        condition: ConditionalRuleCondition.Equals,
      },
      {
        ruleType: ConditionalRuleType.HtmlElement,
        type: HtmlConditionalRuleType.Element,
        condition: ConditionalRuleCondition.NotExists,
      },
    ],
  },
];

export const ConditionalRules = () => {
  const rules = useMemo(
    () => [
      dateRule,
      htmlRule.withoutPicker({
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
            <ConditionalRulesContextProvider context={{}}>
              <ConditionalRulesComponent
                fieldVariant="outlined"
                helperText="Configure rules that happen when various stuff happens."
                label="Rules"
                definitions={rules}
                name="conditionalRules"
              />
            </ConditionalRulesContextProvider>
            <pre>{JSON.stringify(props.values, null, ' ')}</pre>
          </form>
        </FormVariablesProvider>
      )}
    />
  );
};
