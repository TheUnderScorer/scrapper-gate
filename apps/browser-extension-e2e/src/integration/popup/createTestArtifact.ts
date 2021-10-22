import { Page } from 'playwright';
import { persistTestArtifact } from '../../../../../tests/utils/artifacts';

export async function createTestArtifact(page: Page) {
  const { currentTestName } = expect.getState();

  const screenshot = await page.screenshot({
    type: 'png',
  });

  await persistTestArtifact(`${page.url()}-${currentTestName}.png`, screenshot);
}
