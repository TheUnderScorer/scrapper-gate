import { Page } from 'playwright';
import { createTestArtifact } from '../integration/popup/createTestArtifact';

export const debugPage = async (page: Page) => {
  const ctx = page.context();

  console.log('Page debug info:', {
    test: expect.getState().currentTestName,
    url: page.url(),
    allPagesUrls: ctx.pages().map((page) => page.url()),
  });

  await createTestArtifact(page);
};
