import { Description, Home } from '@material-ui/icons';
import React from 'react';
import { act, render, RenderResult } from '@testing-library/react';
import { Form } from 'react-final-form';
import fireEvent from '@testing-library/user-event';
import { CheckboxGroup } from './CheckboxGroup';
import { Selection } from '@scrapper-gate/frontend/common';
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

const renderCmp = (): RenderResult =>
  render(
    <Form
      onSubmit={jest.fn()}
      render={() => (
        <div>
          <CheckboxGroup name="test" options={options} />
        </div>
      )}
    />
  );

describe('<CheckboxGroup />', () => {
  it('should handle selection', async () => {
    const { container } = renderCmp();
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
