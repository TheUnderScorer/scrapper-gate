/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box } from '@mui/material';
import '@scrapper-gate/frontend/block-editor';
import { VariablesProvider } from '@scrapper-gate/frontend/domain/variables';
import '@scrapper-gate/frontend/theme';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { DateFormat, wait } from '@scrapper-gate/shared/common';
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
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format, subDays } from 'date-fns';
import React, { PropsWithChildren } from 'react';
import { Form } from 'react-final-form';
import {
  addGroupAndRule,
  assertTitle,
} from '../../../../../../../tests/domain/conditionalRules/testUtils';
import { baseRulesSelection } from '../../baseRules';
import {
  ConditionalRules,
  ConditionalRulesProps,
} from '../ConditionalRules/ConditionalRules';

jest.mock('react-truncate-markup', () => {
  const Component = (props: PropsWithChildren<unknown>) => props.children;

  Component.Atom = Component;

  return Component;
});

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
            <Box width="1500px" height="1000px">
              <ConditionalRules
                definitions={props.definitions ?? baseRulesSelection}
                name="rules"
              />
            </Box>
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
            <Box width="1000px" height="1000px">
              <VariablesProvider name="variables">
                <ConditionalRules
                  definitions={props.definitions ?? baseRulesSelection}
                  name="rules"
                />
              </VariablesProvider>
            </Box>
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const now = new Date();

describe('<DateRule />', () => {
  it('should render correct title', async () => {
    const cmp = renderCmp();

    addGroupAndRule(cmp, 'Date');

    await act(async () => {
      userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]value"]')!,
        format(now, DateFormat.Date)
      );

      await wait(1000);
    });

    assertTitle(cmp.container, `Dateequals"${format(now, DateFormat.Date)}"`);
  });

  it('should support variables', async () => {
    const cmp = renderCmpWithVariables({
      value: [
        {
          type: ConditionalRuleGroupType.All,
          rules: [
            {
              value: '{{Date}}',
              when: ConditionalRuleWhen.Equals,
              type: ConditionalRuleTypes.Date,
              id: '#id',
            },
          ],
        },
      ],
    });

    await wait(1000);

    assertTitle(cmp.container, `Dateequals"{{Date}}"`);
  });
});
