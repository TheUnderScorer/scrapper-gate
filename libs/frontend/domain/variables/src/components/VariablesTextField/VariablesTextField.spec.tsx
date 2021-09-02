/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { wait } from '@scrapper-gate/shared/common';
import {
  createVariable,
  generateVariableKeyTemplate,
} from '@scrapper-gate/shared/domain/variables';
import { Variable, VariableScope } from '@scrapper-gate/shared/schema';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { VariablesProvider } from '../../providers/VariablesProvider';
import { VariablesTextField } from './VariablesTextField';

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

const renderCmp = (initialValue?: string, onChange = jest.fn()) =>
  render(
    <ThemeProvider>
      <Form
        initialValues={{
          variables,
          variable: initialValue,
        }}
        onSubmit={jest.fn()}
        render={() => (
          <VariablesProvider name="variables">
            <VariablesTextField name="variable" />
            <FormSpy onChange={onChange} />
          </VariablesProvider>
        )}
      />
    </ThemeProvider>
  );

describe('<VariablesTextField />', () => {
  it('should render without crashing', () => {
    const cmp = renderCmp();

    expect(cmp).toBeDefined();
  });

  it('should show variables suggestions', async () => {
    const cmp = renderCmp('{{');
    const input = cmp.container.querySelector<HTMLDivElement>(
      '[contenteditable=true]'
    );

    act(() => {
      input!.focus();
    });

    expect(
      cmp.baseElement.querySelector('.variable-suggestions-container')
    ).toBeInTheDocument();
  });

  it('should add suggestion to value after clicking it', async () => {
    const onChange = jest.fn();
    const cmp = renderCmp('{{Myvar', onChange);
    const input = cmp.container.querySelector<HTMLDivElement>(
      '[contenteditable=true]'
    );

    act(() => {
      input!.focus();
    });

    const listItems = cmp.baseElement.querySelectorAll('.variable-list-item');

    expect(listItems).toHaveLength(1);

    await act(async () => {
      userEvent.click(listItems[0]);

      await wait(500);
    });

    const call = onChange.mock.calls[2][0];

    expect(call.values.variable).toEqual('{{Myvariable}}');
  });

  it('should display variable component on variable', () => {
    const cmp = renderCmp(generateVariableKeyTemplate(variables[0].key!));
    const variable = cmp.container.querySelector('.variable-content');

    expect(variable).toBeInTheDocument();
  });
});
