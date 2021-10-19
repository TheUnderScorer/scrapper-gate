/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import { VariableScope, VariableType } from '@scrapper-gate/shared/schema';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Transforms } from 'slate';
import {
  RenderBlockEditorComponent,
  renderVariablesBlockEditor,
} from '../../../../../../../tests/ui/blockEditor/renderBlockEditor';
import { VariablesAutocomplete } from './VariablesAutocomplete';

const variables = [
  createVariable({
    key: 'Test',
    defaultValue: '123',
    type: VariableType.Text,
    scope: VariableScope.Global,
  }),
];

const options = ['Test', 'Cool', 'Another'];

const Component: RenderBlockEditorComponent = (props) => (
  <VariablesAutocomplete {...props} options={options} />
);

describe('<VariablesAutocomplete />', () => {
  it('should render without crashing', async () => {
    const { cmp } = await renderVariablesBlockEditor({
      variables,
      Component,
    });

    expect(cmp).toMatchSnapshot();
  });

  it('should show suggestions', async () => {
    const { cmp } = await renderVariablesBlockEditor({
      variables,
      Component,
    });

    expect(
      cmp.container.querySelector('.variables-autocomplete-suggestions')
    ).toBeInTheDocument();

    expect(
      cmp.container.querySelectorAll('.variables-autocomplete-suggestion')
    ).toHaveLength(options.length);
  });

  it('should show filtered suggestions', async () => {
    const { cmp } = await renderVariablesBlockEditor({
      variables,
      Component,
      initialValue: 'Tes',
    });

    const suggestions = cmp.container.querySelectorAll(
      '.variables-autocomplete-suggestion'
    );

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toHaveTextContent(/Test/);
  });

  it('should set text field value to clicked suggestion', async () => {
    const { cmp, editor } = await renderVariablesBlockEditor({
      variables,
      Component,
      initialValue: 'Tes',
    });

    const suggestion = cmp.container.querySelector(
      '.variables-autocomplete-suggestion'
    )!;

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

    act(() => {
      userEvent.click(suggestion);
    });

    expect(
      cmp.container.querySelector('[contenteditable=true]')
    ).toHaveTextContent(/Test/);
  });
});
