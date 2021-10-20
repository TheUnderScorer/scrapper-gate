import { repeatUntil } from '@scrapper-gate/shared/common';
import { initialActiveTabUrl } from '@scrapper-gate/shared/routing';
import { BrowserContext } from 'playwright';
import { register } from './popup';

const waitAfterIteration = 1000;

export async function createNewUserWithScrapper(browser: BrowserContext) {
  const { page } = await register(browser);

  const createScrapperPage = await repeatUntil(async () => {
    const btn = await page.$('.MuiFab-root');

    await btn?.click();

    const createScrapperPage = browser
      .pages()
      .find((page) => page.url().includes(initialActiveTabUrl));

    expect(createScrapperPage).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return createScrapperPage!;
  });

  await repeatUntil(
    async () => {
      const form = await createScrapperPage.$('.create-scrapper-form');

      expect(form).toBeTruthy();
    },
    { waitAfterIteration }
  );

  await createScrapperPage.click('text=Real browser');
  await createScrapperPage.type('[name="name"]', 'Test scrapper');
  await createScrapperPage.click('[type="submit"]');
  return createScrapperPage;
}
