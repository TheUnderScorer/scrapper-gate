import { scrapperTypeSelectionOptions } from '@scrapper-gate/frontend/domain/scrapper';
import { ScrapperType } from '@scrapper-gate/shared/schema';
import { BrowserContext } from 'playwright';
import { openContentScriptUrl } from '../utils/contentScript';
import { debugPage } from '../utils/debug';
import { repeatUntil } from '../utils/repeatUntil';
import { register } from './popup';

export async function createNewUserWithScrapper(
  browser: BrowserContext,
  type = ScrapperType.RealBrowser
) {
  await register(browser);

  const label = scrapperTypeSelectionOptions.find(
    (selection) => selection.value === type
  )?.label;

  if (!label) {
    throw new TypeError(`Unable to find label for scrapper type: ${type}`);
  }

  // TODO Move content script routes to shared routes
  const createScrapperPage = await openContentScriptUrl(
    browser,
    '/create-scrapper'
  );

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
