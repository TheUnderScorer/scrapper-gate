import { BlockEditorProps } from '@scrapper-gate/frontend/block-editor';
import {
  FormVariablesProvider,
  VariablesTextField,
} from '@scrapper-gate/frontend/domain/variables';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { wait } from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import { render } from '@testing-library/react';
import React, { ComponentType } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { Editor } from 'slate';

export type RenderBlockEditorComponent = ComponentType<
  Pick<BlockEditorProps, 'editorInstanceRef' | 'initialFocused'> & {
    name: string;
  }
>;

interface RenderBlockEditorParams {
  variables: Variable[];
  initialValue?: string;
  onChange?: jest.Mock;
  Component?: RenderBlockEditorComponent;
}

export const renderVariablesBlockEditor = async ({
  variables,
  initialValue,
  onChange = jest.fn(),
  Component = VariablesTextField,
}: RenderBlockEditorParams) => {
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
          <FormVariablesProvider name="variables">
            <Component
              editorInstanceRef={(instance) => {
                if (instance) {
                  editor = instance;
                }
              }}
              initialFocused
              name="variable"
            />
            <FormSpy onChange={onChange} />
          </FormVariablesProvider>
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
