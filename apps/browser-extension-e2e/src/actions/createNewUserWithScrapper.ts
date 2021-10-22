import { scrapperTypeSelectionOptions } from '@scrapper-gate/frontend/domain/scrapper';
import { initialActiveTabUrl } from '@scrapper-gate/shared/routing';
import { ScrapperType } from '@scrapper-gate/shared/schema';
import { BrowserContext } from 'playwright';
import { debugPage } from '../utils/debug';
import { repeatUntil } from '../utils/repeatUntil';
import { register } from './popup';

export async function createNewUserWithScrapper(
  browser: BrowserContext,
  type = ScrapperType.RealBrowser
) {
  const { page } = await register(browser);

  const label = scrapperTypeSelectionOptions.find(
    (selection) => selection.value === type
  )?.label;

  if (!label) {
    throw new TypeError(`Unable to find label for scrapper type: ${type}`);
  }

  const createScrapperPage = await repeatUntil(async () => {
    const btn = await page.$('.MuiFab-root');

    await btn?.click();

    const createScrapperPage = browser
      .pages()
      .find((page) => page.url().includes(initialActiveTabUrl));

    if (!createScrapperPage) {
      await debugPage(page);
    }

    expect(createScrapperPage).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return createScrapperPage!;
  });

  await repeatUntil(async () => {
    const form = await createScrapperPage.$('.create-scrapper-form');

    if (!form) {
      await debugPage(createScrapperPage);
    }

    expect(form).toBeTruthy();
  });

  await createScrapperPage.click(`text=${label}`);
  await createScrapperPage.type('[name="name"]', 'Test scrapper');
  await createScrapperPage.click('[type="submit"]');
  return createScrapperPage;
}
