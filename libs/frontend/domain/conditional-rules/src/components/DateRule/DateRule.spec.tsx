import { LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { DateFormat } from '@scrapper-gate/shared/common';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import React from 'react';
import { Form } from 'react-final-form';
import { baseRulesSelection } from '../../baseRules';
import {
  ConditionalRules,
  ConditionalRulesProps,
} from '../ConditionalRules/ConditionalRules';
import { addGroupAndRule, assertTitle } from '../ConditionalRules/testUtils';

const renderCmp = (props: Partial<ConditionalRulesProps> = {}) => {
  return render(
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form
          onSubmit={jest.fn()}
          render={() => (
            <ConditionalRules
              definitions={props.definitions ?? baseRulesSelection}
              name="rules"
            />
          )}
        />
      </LocalizationProvider>
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
