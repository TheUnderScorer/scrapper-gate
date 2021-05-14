import { render, RenderResult, act } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import { Form } from 'react-final-form';
import { Description, Home } from '@material-ui/icons';
import React from 'react';
import { RadioGroup } from './RadioGroup';
import { Selection } from '@scrapper-gate/frontend/common';

const options: Selection[] = [
  {
    label: 'Value 1',
    value: 'value_1',
    icon: <Home />,
  },
  {
    label: 'Value 2',
    value: 'value_2',
    icon: <Description />,
  },
];

const renderCmp = (): RenderResult =>
  render(
    <Form
      onSubmit={jest.fn()}
      render={() => (
        <div>
          <RadioGroup name="test" options={options} />
        </div>
      )}
    />
  );

describe('<RadioGroup />', () => {
  it('should handle selected item', () => {
    const { container } = renderCmp();
    const item = container.querySelector('.selectable-paper');

    act(() => {
      fireEvent.click(item);
    });

    let checked: Element | null = container.querySelector('.checked');
    expect(checked).toBeDefined();
    expect(checked.textContent).toContain('Value 1');

    act(() => {
      fireEvent.click(checked);
    });

    checked = container.querySelector('.checked');
    expect(checked).toBeNull();
  });
});
