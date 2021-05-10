import {
  baseRulesSelection,
  ConditionalRules,
  ConditionalRulesProps,
} from '@scrapper-gate/frontend/domain/conditional-rules';
import { act, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Form } from 'react-final-form';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import { DateFormat } from '@scrapper-gate/shared/common';

const renderCmp = (props: Partial<ConditionalRulesProps> = {}) => {
  return render(
    <ThemeProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Form
          onSubmit={jest.fn()}
          render={() => (
            <ConditionalRules
              definitions={props.definitions ?? baseRulesSelection}
              name="rules"
            />
          )}
        />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

const now = new Date();

describe('<DateRule />', () => {
  it('should render correct title', () => {
    const cmp = renderCmp();

    act(() => {
      userEvent.click(cmp.getByText('Add rules group'));
    });

    act(() => {
      userEvent.click(cmp.getByText('Add rule'));
      userEvent.click(cmp.getByText('Date'));
    });

    act(() => {
      userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]value"]'),
        format(now, DateFormat.Date)
      );
    });

    expect(
      cmp.getByText(`Date equal ${format(now, DateFormat.Date)}`)
    ).toBeInTheDocument();
  });
});
