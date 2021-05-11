import {
  baseRulesSelection,
  ConditionalRules,
  ConditionalRulesProps,
} from '@scrapper-gate/frontend/domain/conditional-rules';
import { act, render } from '@testing-library/react';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Form } from 'react-final-form';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import { DateFormat } from '@scrapper-gate/shared/common';
import { addGroupAndRule, assertTitle } from '../ConditionalRules/testUtils';

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

    addGroupAndRule(cmp, 'Date');

    act(() => {
      userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]value"]'),
        format(now, DateFormat.Date)
      );
    });

    assertTitle(cmp.container, `Date equals "${format(now, DateFormat.Date)}"`);
  });
});