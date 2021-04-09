import { Description, Home } from '@material-ui/icons';
import React from 'react';
import { act, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import { CheckboxGroup } from './CheckboxGroup';
import { useForm } from 'react-hook-form';
import { Selection } from '@scrapper-gate/shared-frontend/common';
import { wait } from '@scrapper-gate/shared/common';

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
  {
    label: 'Value 3',
    value: 'value_3',
    icon: <Description />,
  },
];

const Cmp = () => {
  const form = useForm();

  return (
    <div>
      <CheckboxGroup name="test" control={form.control} options={options} />
    </div>
  );
};

describe('<CheckboxGroup />', () => {
  it('should handle selection', async () => {
    const { container } = render(<Cmp />);
    const checkboxes = Array.from(
      container.querySelectorAll('.tile-checkbox-container')
    ).slice(0, 2);

    await act(async () => {
      fireEvent.click(checkboxes[0]);

      await wait(500);

      fireEvent.click(checkboxes[1]);

      await wait(500);
    });

    let selected = Array.from(container.querySelectorAll('.checked'));
    expect(selected).toHaveLength(2);

    await act(async () => {
      fireEvent.click(checkboxes[0]);

      await wait(500);
    });

    selected = Array.from(container.querySelectorAll('.checked'));
    expect(selected).toHaveLength(1);
  });
});
