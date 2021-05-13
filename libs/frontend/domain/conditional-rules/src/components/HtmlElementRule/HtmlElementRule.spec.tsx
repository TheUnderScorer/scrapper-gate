import { act, render, RenderResult } from '@testing-library/react';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Form } from 'react-final-form';
import React from 'react';
import { addGroupAndRule, assertTitle } from '../ConditionalRules/testUtils';
import { logger } from '@scrapper-gate/frontend/logger';
import userEvent from '@testing-library/user-event';
import { makeHtmlElementRule } from '../../rules/htmlRule';
import {
  ConditionalRules,
  ConditionalRulesProps,
} from '../ConditionalRules/ConditionalRules';

const rules = [
  makeHtmlElementRule({
    highlightId: 'test',
  }),
];

const renderCmp = (props: Partial<ConditionalRulesProps> = {}) => {
  return render(
    <ThemeProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Form
          onSubmit={jest.fn()}
          render={() => (
            <ConditionalRules
              definitions={props.definitions ?? rules}
              name="rules"
            />
          )}
        />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

type Handler = (cmp: RenderResult) => unknown;

type TestCase = [Handler, string];

const handlers = {
  onlyExists: (cmp: RenderResult) => {
    assertTitle(cmp.container, 'Html element exists');
  },
  validAttributeWithValue: async (cmp: RenderResult) => {
    act(() => {
      userEvent.click(
        cmp.container.querySelector(
          '[aria-labelledby="mui-component-select-rules[0].rules[0]what"]'
        )
      );
    });

    act(() => {
      userEvent.click(cmp.getByText('Attribute'));
    });

    act(() => {
      userEvent.click(
        cmp.container.querySelector(
          '[aria-labelledby="mui-component-select-rules[0].rules[0]when"]'
        )
      );
    });

    act(() => {
      userEvent.click(cmp.getByText('Equals'));
    });

    await act(async () => {
      await userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]meta.attribute"]'),
        'test-id',
        {
          delay: 10,
        }
      );
    });

    await act(async () => {
      await userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]value"]'),
        '123',
        {
          delay: 10,
        }
      );
    });
  },
  validTagWithAttribute: async (cmp: RenderResult) => {
    act(() => {
      userEvent.click(
        cmp.container.querySelector(
          '[aria-labelledby="mui-component-select-rules[0].rules[0]what"]'
        )
      );
    });

    act(() => {
      userEvent.click(cmp.getByText('Tag'));
    });

    act(() => {
      userEvent.click(
        cmp.container.querySelector(
          '[aria-labelledby="mui-component-select-rules[0].rules[0]when"]'
        )
      );
    });

    act(() => {
      userEvent.click(cmp.getByText('Equals'));
    });

    await act(async () => {
      await userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]value"]'),
        'DIV',
        {
          delay: 10,
        }
      );
    });
  },
};

describe('<HtmlElementRule />', () => {
  beforeAll(() => {
    // Final form sometimes throws in this test
    process.on('unhandledRejection', (reason) => {
      if (reason instanceof Error) {
        logger.debug(reason.message);
        logger.debug(reason.stack);
      }
    });
  });

  it.each<TestCase>([
    [handlers.onlyExists, 'Html element exists'],
    [
      handlers.validAttributeWithValue,
      'Html element attribute "test-id" equals "123"',
    ],
    [handlers.validTagWithAttribute, 'Html element tag name equals "DIV"'],
  ])('should render correct title', async (handler, expectedTitle) => {
    const cmp = renderCmp();

    addGroupAndRule(cmp, 'HTML Element');

    await handler(cmp);

    assertTitle(cmp.container, expectedTitle);
  });

  it('should show logic dropdown if selectors are provided', async () => {
    const cmp = renderCmp();

    addGroupAndRule(cmp, 'HTML Element');

    await act(async () => {
      await userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]meta.selectors"]'),
        'span',
        {
          delay: 10,
        }
      );
    });

    act(() => {
      userEvent.click(cmp.container.querySelector('.add-selector'));
    });

    expect(
      cmp.getByText('elements must match this condition.')
    ).toBeInTheDocument();
  });
});
