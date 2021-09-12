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
import { Editor, Transforms } from 'slate';
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

const renderCmp = async (initialValue?: string, onChange = jest.fn()) => {
  let editor: Editor | undefined;

  const cmp = render(
    <ThemeProvider>
      <Form
        initialValues={{
          variables,
          variable: initialValue,
        }}
        onSubmit={jest.fn()}
        render={() => (
          <VariablesProvider name="variables">
            <VariablesTextField
              editorInstanceRef={(instance) => {
                if (instance) {
                  editor = instance;
                }
              }}
              initialFocused
              name="variable"
            />
            <FormSpy onChange={onChange} />
          </VariablesProvider>
        )}
      />
    </ThemeProvider>
  );

  while (!editor) {
    await wait(250);
  }

  return {
    editor,
    cmp,
  };
};

describe('<VariablesTextField />', () => {
  it('should render without crashing', async () => {
    const { cmp } = await renderCmp();

    expect(cmp).toBeDefined();
  });

  it('should show variables suggestions', async () => {
    const { cmp, editor } = await renderCmp('{{');
    cmp.container.querySelector<HTMLDivElement>('[contenteditable]');
    act(() => {
      Transforms.select(editor, {
        anchor: {
          path: [0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 0],
          offset: 2,
        },
      });
    });

    await act(async () => {
      await wait(500);
    });

    expect(
      cmp.baseElement.querySelector('.variable-suggestions-container')
    ).toBeInTheDocument();
  }, 9999999);

  it('should add suggestion to value after clicking it', async () => {
    const onChange = jest.fn();
    const { cmp, editor } = await renderCmp('{{Myvar', onChange);
    cmp.container.querySelector<HTMLDivElement>('[contenteditable=true]');
    act(() => {
      Transforms.select(editor, {
        anchor: {
          path: [0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 0],
          offset: 6,
        },
      });
    });

    await act(async () => {
      await wait(500);
    });

    const listItems = cmp.baseElement.querySelectorAll('.variable-list-item');

    expect(listItems).toHaveLength(1);

    await act(async () => {
      userEvent.click(listItems[0]);

      await wait(500);
    });

    expect(onChange.mock.calls[1][0].values.variable).toEqual('{{Myvariable}}');
  });

  it('should display variable component on variable', async () => {
    const { cmp } = await renderCmp(
      generateVariableKeyTemplate(variables[0].key!)
    );
    const variable = cmp.container.querySelector('.variable-content');

    expect(variable).toBeInTheDocument();
  });
});
