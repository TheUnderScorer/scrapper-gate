import { act, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import { Description, Home } from '@material-ui/icons';
import React from 'react';
import { RadioGroup } from './RadioGroup';
import { useForm } from 'react-hook-form';
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

const Cmp = () => {
  const form = useForm();

  return (
    <div>
      <RadioGroup name="test" options={options} control={form.control} />
    </div>
  );
};

describe('<RadioGroup />', () => {
  it('should handle selected item', () => {
    const { container } = render(<Cmp />);
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
