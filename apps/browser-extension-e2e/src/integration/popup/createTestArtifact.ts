import { Page } from 'playwright';
import { persistTestArtifact } from '../../../../../tests/utils/artifacts';
import { getTestId } from '../../getTestId';

export async function createTestArtifact(page: Page) {
  const id = getTestId(page);

  const screenshot = await page.screenshot({
    type: 'png',
  });

  await persistTestArtifact(`${id}.png`, screenshot);
}
