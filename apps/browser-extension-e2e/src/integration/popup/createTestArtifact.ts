import { Page } from 'playwright';
import { persistTestArtifact } from '../../../../../tests/utils/artifacts';

export async function createTestArtifact(page: Page) {
  const { currentTestName } = expect.getState();

  const screenshot = await page.screenshot({
    type: 'png',
  });

  const url = page.url().replace(/\//g, '-');

  await persistTestArtifact(`${url}-${currentTestName}.png`, screenshot);
}
