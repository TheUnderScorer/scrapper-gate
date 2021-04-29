import { act, render, fireEvent as fireEventAlt } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import React from 'react';
import { Form } from 'react-final-form';
import { IncrementatorProps, Incrementator } from './Incrementator';
import { wait } from '@scrapper-gate/shared/common';

const renderCmp = (props: IncrementatorProps) =>
  render(
    <Form onSubmit={jest.fn()} render={() => <Incrementator {...props} />} />
  );

describe('<Incrementator />', () => {
  it('should handle incrementation and decrementation', () => {
    const { container } = renderCmp({
      name: 'test',
    });

    const increment = container.querySelector('.incrementator-increment')!;
    const decrement = container.querySelector('.incrementator-decrement')!;

    act(() => {
      fireEvent.click(increment);
    });

    let input = container.querySelector<HTMLInputElement>(
      '.incrementator-input .MuiInputBase-input'
    )!;

    expect(input.value).toEqual('1');

    act(() => {
      fireEvent.click(decrement);
    });

    input = container.querySelector<HTMLInputElement>(
      '.incrementator-input .MuiInputBase-input'
    )!;

    expect(input.value).toEqual('0');
  });

  it('should handle long press on decrementation', async () => {
    const { container } = renderCmp({
      name: 'test',
      initialValue: 100,
    });

    const increment = container.querySelector('.incrementator-decrement')!;

    await act(async () => {
      fireEventAlt.mouseDown(increment);

      await wait(3000);

      fireEventAlt.mouseUp(increment);
    });

    const input = container.querySelector<HTMLInputElement>(
      '.incrementator-input .MuiInputBase-input'
    )!;

    expect(parseInt(input.value, 10)).toBeLessThanOrEqual(90);
  });

  it('should handle long press on incrementation', async () => {
    const { container } = renderCmp({
      name: 'test',
      initialValue: 0,
    });

    const increment = container.querySelector('.incrementator-increment')!;

    await act(async () => {
      fireEventAlt.mouseDown(increment);

      await wait(3000);

      fireEventAlt.mouseUp(increment);
    });

    const input = container.querySelector<HTMLInputElement>(
      '.incrementator-input .MuiInputBase-input'
    )!;

    expect(parseInt(input.value, 10)).toBeGreaterThanOrEqual(10);
  });
});
