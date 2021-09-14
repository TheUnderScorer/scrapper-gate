/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { wait } from '@scrapper-gate/shared/common';
import { act, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'react-final-form';
import { FormTextField } from '../FormTextField/FormTextField';
import { UnsavedFormAlert } from './UnsavedFormAlert';

const submitDelay = 400;

const onSubmit = () => wait(submitDelay);

const Wrapper = () => {
  return (
    <Form
      onSubmit={onSubmit}
      render={(props) => (
        <form onSubmit={props.handleSubmit}>
          <div
            className="target"
            onClick={() => props.form.change('test', 'test')}
          >
            <UnsavedFormAlert />
            <FormTextField name="test" />
          </div>
          <button type="submit" className="submit">
            Submit
          </button>
        </form>
      )}
    />
  );
};

function createAndDispatchEvent() {
  const preventDefault = jest.fn();
  const setReturnValue = jest.fn();

  const event = new Event('beforeunload');

  Object.assign(event, {
    preventDefault,
  });

  Object.defineProperty(event, 'returnValue', {
    set: setReturnValue,
  });

  window.dispatchEvent(event);

  return { preventDefault, setReturnValue };
}

function setFormAsDirty(cmp: RenderResult) {
  userEvent.click(cmp.container.querySelector('.target')!);
}

describe('<UnsavedFormAlert />', () => {
  it('should prevent leave if form is dirty', () => {
    const cmp = render(<Wrapper />);

    act(() => {
      setFormAsDirty(cmp);
    });

    const { preventDefault, setReturnValue } = createAndDispatchEvent();

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(setReturnValue).toHaveBeenCalledWith('You have unsaved changes!');
  });

  it('should not prevent leave if form is not dirty', () => {
    render(<Wrapper />);

    const { preventDefault } = createAndDispatchEvent();

    expect(preventDefault).toHaveBeenCalledTimes(0);
  });

  it('should reset dirty state on form submit', async () => {
    const cmp = render(<Wrapper />);

    act(() => {
      setFormAsDirty(cmp);
    });

    act(() => {
      userEvent.click(cmp.container.querySelector('.submit')!);
    });

    await wait(submitDelay + 100);

    const { preventDefault } = createAndDispatchEvent();

    expect(preventDefault).toHaveBeenCalledTimes(0);
  });
});
