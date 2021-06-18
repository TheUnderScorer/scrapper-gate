/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Form } from 'react-final-form';
import { Key } from 'ts-key-enum';
import { FormEditableText, FormEditableTextProps } from './FormEditableText';
import '@testing-library/jest-dom';

const renderCmp = (props: Partial<FormEditableTextProps> = {}) => {
  return render(
    <Form
      initialValues={{
        text: 'Test',
      }}
      onSubmit={jest.fn()}
      render={() => <FormEditableText name="text" {...props} />}
    />
  );
};

const getText = (container: HTMLElement) =>
  container.querySelector('.form-editable-text');

const enableEdit = (container: HTMLElement) => {
  act(() => {
    userEvent.click(getText(container)!);
  });
};

const getInput = (container: HTMLElement) =>
  container.querySelector('.form-editable-text-field input');

const setValue = async (container: HTMLElement, value: string) => {
  const input = getInput(container);

  act(() => {
    userEvent.clear(input!);
  });

  await act(async () => {
    await userEvent.type(input!, value, {
      delay: 100,
    });
  });
};

describe('<FormEditableText />', () => {
  it('should render without crashing', () => {
    const cmp = renderCmp();

    expect(cmp).toMatchSnapshot();
  });

  it('should edit field on outside click', async () => {
    const callback = jest.fn();

    const cmp = renderCmp({
      onEditFinish: callback,
    });

    enableEdit(cmp.container);

    await setValue(cmp.container, 'New value');

    act(() => {
      userEvent.click(document.body);
    });

    expect(callback).toHaveBeenCalledWith('New value');
  });

  it('should edit field on enter press', async () => {
    const callback = jest.fn();

    const cmp = renderCmp({
      onEditFinish: callback,
    });

    enableEdit(cmp.container);

    await setValue(cmp.container, 'New value');

    act(() => {
      fireEvent.keyDown(getInput(cmp.container!)!, {
        key: Key.Enter,
      });
    });

    expect(callback).toHaveBeenCalledWith('New value');
  });

  it('should not edit field on escape press', async () => {
    const callback = jest.fn();

    const cmp = renderCmp({
      onEditFinish: callback,
    });

    enableEdit(cmp.container);

    await setValue(cmp.container, 'New value');

    act(() => {
      fireEvent.keyDown(getInput(cmp.container)!, {
        key: Key.Escape,
      });
    });

    expect(callback).toHaveBeenCalledTimes(0);

    expect(getText(cmp.container)).toHaveTextContent('Test');
  });
});
