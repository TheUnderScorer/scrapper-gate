import { Page } from 'playwright';

export const getTestId = (page: Page) => {
  const { currentTestName } = expect.getState();
  const url = page.url().replace(/[/:#,<>*?]/g, '-');

  return `${url}-${currentTestName}`;
};
