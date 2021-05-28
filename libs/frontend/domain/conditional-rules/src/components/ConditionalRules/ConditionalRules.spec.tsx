import { LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import '@scrapper-gate/frontend/theme';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Form } from 'react-final-form';
import { baseRulesSelection } from '../../baseRules';
import { ConditionalRules, ConditionalRulesProps } from './ConditionalRules';

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

describe('<ConditionalRules />', () => {
  it('should render without crashing', () => {
    const cmp = renderCmp();

    expect(cmp).toMatchSnapshot();
  });

  it('should add new group and rule', () => {
    const cmp = renderCmp();

    act(() => {
      userEvent.click(cmp.getByText('Add rules group'));
    });

    const groups = cmp.container.querySelectorAll('.conditional-rules-group');

    expect(groups).toHaveLength(1);
    expect(groups[0].querySelector('.Mui-expanded')).toBeInTheDocument();

    act(() => {
      userEvent.click(cmp.getByText('Add rule'));
      userEvent.click(cmp.getByText('Date'));
    });

    const rules = cmp.container.querySelectorAll('.conditional-rules-rule');

    expect(rules).toHaveLength(1);
    expect(rules[0].querySelector('.Mui-expanded')).toBeInTheDocument();
  });

  it('should remove group', () => {
    const cmp = renderCmp();

    act(() => {
      userEvent.click(cmp.getByText('Add rules group'));
    });

    act(() => {
      userEvent.click(cmp.container.querySelector('.remove-rules-group'));
    });

    const groups = cmp.container.querySelectorAll('.conditional-rules-group');

    expect(groups).toHaveLength(0);
  });

  it('should remove rule', () => {
    const cmp = renderCmp();

    act(() => {
      userEvent.click(cmp.getByText('Add rules group'));
    });

    act(() => {
      userEvent.click(cmp.getByText('Add rule'));
      userEvent.click(cmp.getByText('Date'));
    });

    act(() => {
      userEvent.click(cmp.container.querySelector('.remove-rules-rule'));
    });

    const rules = cmp.container.querySelectorAll('.conditional-rules-rule');

    expect(rules).toHaveLength(0);
  });
});
