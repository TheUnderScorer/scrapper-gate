import { act, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const assertTitle = (container: HTMLElement, titleText: string) => {
  const title = container.querySelector('.conditional-rules-rule-title');

  expect(title).toHaveTextContent(titleText);
};

export const addGroupAndRule = (cmp: RenderResult, ruleText: string) => {
  act(() => {
    userEvent.click(cmp.getByText('Add rules group'));
  });

  act(() => {
    userEvent.click(cmp.getByText('Add rule'));
    userEvent.click(cmp.getByText(ruleText));
  });
};
