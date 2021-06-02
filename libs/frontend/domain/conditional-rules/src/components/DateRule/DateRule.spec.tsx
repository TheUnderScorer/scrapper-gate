import { LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { VariablesProvider } from '@scrapper-gate/frontend/domain/variables';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { DateFormat } from '@scrapper-gate/shared/common';
import {
  BaseConditionalRuleWhen,
  ConditionalRuleTypes,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  ConditionalRuleGroupType,
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format, subDays } from 'date-fns';
import React from 'react';
import { Form } from 'react-final-form';
import { baseRulesSelection } from '../../baseRules';
import {
  ConditionalRules,
  ConditionalRulesProps,
} from '../ConditionalRules/ConditionalRules';
import { addGroupAndRule, assertTitle } from '../ConditionalRules/testUtils';

const variables: Variable[] = [
  createVariable({
    key: 'Myvariable',
    value: 'Variable test',
    defaultValue: 'Test',
    scope: VariableScope.Global,
  }),
  createVariable({
    key: 'Date',
    defaultValue: subDays(new Date(), 2).toISOString(),
    scope: VariableScope.Global,
    type: VariableType.Date,
  }),
];

const renderCmp = (props: Partial<ConditionalRulesProps> = {}) => {
  return render(
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form
          onSubmit={jest.fn()}
          render={() => (
            <ConditionalRules
              definitions={props.definitions ?? baseRulesSelection}
              name="rules"
            />
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const renderCmpWithVariables = (props: Partial<ConditionalRulesProps> = {}) => {
  return render(
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form
          initialValues={{ variables, rules: props.value }}
          onSubmit={jest.fn()}
          render={() => (
            <VariablesProvider name="variables">
              <ConditionalRules
                definitions={props.definitions ?? baseRulesSelection}
                name="rules"
              />
            </VariablesProvider>
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const now = new Date();

describe('<DateRule />', () => {
  it('should render correct title', () => {
    const cmp = renderCmp();

    addGroupAndRule(cmp, 'Date');

    act(() => {
      userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]value"]'),
        format(now, DateFormat.Date)
      );
    });

    assertTitle(cmp.container, `Date equals "${format(now, DateFormat.Date)}"`);
  });

  it('should support variables', () => {
    const cmp = renderCmpWithVariables({
      value: [
        {
          type: ConditionalRuleGroupType.All,
          rules: [
            {
              value: '{{Date}}',
              when: BaseConditionalRuleWhen.Equals,
              type: ConditionalRuleTypes.Date,
              id: '#id',
            },
          ],
        },
      ],
    });
    const date = new Date(variables[1].defaultValue);

    assertTitle(
      cmp.container,
      `Date equals "${format(date, DateFormat.Date)}"`
    );
  });
});
