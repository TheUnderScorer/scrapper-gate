/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { DateFormat, wait } from '@scrapper-gate/shared/common';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import '@testing-library/jest-dom';
import { act, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import React from 'react';
import { Form } from 'react-final-form';
import { VariablesProvider } from '../../providers/VariablesProvider';
import { VariablesTable } from './VariablesTable';

const variables: Variable[] = [
  createVariable({
    scope: VariableScope.Scrapper,
    key: 'Name',
    defaultValue: 'Test',
    type: VariableType.Text,
  }),
  createVariable({
    scope: VariableScope.Scrapper,
    key: 'Date',
    value: format(new Date(), DateFormat.Date),
    type: VariableType.Date,
  }),
  createVariable({
    scope: VariableScope.Global,
    key: 'Number',
    value: 25,
    type: VariableType.Number,
  }),
];

const getUi = (defaultVariables: Variable[]) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <ThemeProvider>
      <Form
        initialValues={{
          variables: defaultVariables,
        }}
        onSubmit={jest.fn()}
        render={() => (
          <VariablesProvider name="variables">
            <VariablesTable scope={VariableScope.Global} name="variables" />
          </VariablesProvider>
        )}
      />
    </ThemeProvider>
  </LocalizationProvider>
);

const renderComponent = async (defaultVariables = variables) => {
  let cmp: RenderResult;

  act(() => {
    cmp = render(getUi(defaultVariables));
  });

  await act(async () => {
    await wait(500);
  });

  return cmp!;
};

describe('<VariablesTable />', () => {
  it('should render without crashing', () => {
    const cmp = renderComponent();

    expect(cmp).toBeDefined();
  });

  it('should display message if no variables exist', async () => {
    const cmp = await renderComponent([]);

    expect(await cmp.findByText('No variables found')).toBeInTheDocument();
  });

  it('should add new variable', async () => {
    const cmp = await renderComponent([]);

    act(() => {
      userEvent.click(cmp.container.querySelector('.add-variable')!);
    });

    const rows = cmp.container.querySelectorAll('.variable-row');

    expect(rows).toHaveLength(1);
  });
});
