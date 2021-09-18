/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box } from '@mui/material';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { wait } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import '@testing-library/jest-dom';
import { act, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { PropsWithChildren } from 'react';
import { Form } from 'react-final-form';
import {
  addGroupAndRule,
  assertTitle,
} from '../../../../../../../tests/domain/conditionalRules/testUtils';
import { mockSlate } from '../../../../../../../tests/mocks/mockSlate';
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

jest.mock('react-truncate-markup', () => {
  const Component = (props: PropsWithChildren<unknown>) => props.children;

  Component.Atom = Component;

  return Component;
});

const renderCmp = (props: Partial<ConditionalRulesProps> = {}) => {
  return render(
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form
          onSubmit={jest.fn()}
          render={() => (
            <Box width="1500px" height="1500px">
              <ConditionalRules
                definitions={props.definitions ?? rules}
                name="rules"
              />
            </Box>
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

type Handler = (cmp: RenderResult) => unknown;

type TestCase = [Handler, string];

const handlers = {
  onlyExists: (cmp: RenderResult) => {
    assertTitle(cmp.container, 'Html elementexists');
  },
  validAttributeWithValue: async (cmp: RenderResult) => {
    act(() => {
      userEvent.click(
        cmp.container.querySelector(
          '[aria-labelledby="mui-component-select-rules[0].rules[0]what"]'
        )!
      );
    });

    act(() => {
      userEvent.click(cmp.getByText('Attribute'));
    });

    act(() => {
      userEvent.click(
        cmp.container.querySelector(
          '[aria-labelledby="mui-component-select-rules[0].rules[0]when"]'
        )!
      );
    });

    act(() => {
      userEvent.click(cmp.getByText('Equals'));
    });

    await act(async () => {
      await userEvent.type(
        cmp.container.querySelector(
          '[name="rules[0].rules[0]meta.attribute"]'
        )!,
        'test-id'
      );

      await wait(1000);
    });

    await act(async () => {
      await userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]value"]')!,
        '123'
      );

      await wait(1000);
    });
  },
  validTagWithAttribute: async (cmp: RenderResult) => {
    act(() => {
      userEvent.click(
        cmp.container.querySelector(
          '[aria-labelledby="mui-component-select-rules[0].rules[0]what"]'
        )!
      );
    });

    act(() => {
      userEvent.click(cmp.getByText('Tag'));
    });

    act(() => {
      userEvent.click(
        cmp.container.querySelector(
          '[aria-labelledby="mui-component-select-rules[0].rules[0]when"]'
        )!
      );
    });

    act(() => {
      userEvent.click(cmp.getByText('Equals'));
    });

    await act(async () => {
      await userEvent.type(
        cmp.container.querySelector('[name="rules[0].rules[0]value"]')!,
        'DIV'
      );

      await wait(1000);
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

  beforeEach(() => {
    mockSlate();
  });

  it.each<TestCase>([
    [handlers.onlyExists, 'Html elementexists'],
    [
      handlers.validAttributeWithValue,
      'Html elementattributetest-idequals"123"',
    ],
    [handlers.validTagWithAttribute, 'Html elementtag nameequals"DIV"'],
  ])(
    'should render correct title',
    async (handler, expectedTitle) => {
      const cmp = renderCmp();

      addGroupAndRule(cmp, 'HTML Element');

      await handler(cmp);

      assertTitle(cmp.container, expectedTitle);
    },
    50000
  );

  it('should show logic dropdown if selectors are provided', async () => {
    const cmp = renderCmp();

    addGroupAndRule(cmp, 'HTML Element');

    await act(async () => {
      await userEvent.type(
        cmp.container.querySelector(
          '[name="rules[0].rules[0]meta.selectors"]'
        )!,
        'span'
      );
    });

    act(() => {
      userEvent.click(cmp.container.querySelector('.add-selector')!);
    });

    expect(
      cmp.getByText('elements must match this condition.')
    ).toBeInTheDocument();
  });
});
