/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Description, Home } from '@mui/icons-material';
import { Selection } from '@scrapper-gate/frontend/common';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { act, render, RenderResult } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import React from 'react';
import { Form } from 'react-final-form';
import { RadioGroup } from './RadioGroup';

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
    <ThemeProvider>
      <Form
        onSubmit={jest.fn()}
        render={() => (
          <div>
            <RadioGroup name="test" options={options} />
          </div>
        )}
      />
    </ThemeProvider>
  );

describe('<RadioGroup />', () => {
  it('should handle selected item', () => {
    const { container } = renderCmp();
    const item = container.querySelector('.selectable-paper');

    act(() => {
      fireEvent.click(item!);
    });

    let checked: Element | null = container.querySelector('.checked');
    expect(checked).toBeDefined();
    expect(checked!.textContent).toContain('Value 1');

    act(() => {
      fireEvent.click(checked!);
    });

    checked = container.querySelector('.checked');
    expect(checked).toBeNull();
  });
});
