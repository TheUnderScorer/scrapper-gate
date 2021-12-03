import { scrapperTypeSelectionOptions } from '@scrapper-gate/frontend/domain/scrapper';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
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

  const createScrapperPage = await openContentScriptUrl(
    browser,
    browserExtensionRoutes.content.createScrapper
  );

  await repeatUntil(async () => {
    const form = await createScrapperPage.$('.create-scrapper-form');

    if (!form) {
      await debugPage(createScrapperPage);
    }

    expect(form).toBeTruthy();
  });

  // Simple is default pre-selected value
  if (type !== ScrapperType.Simple) {
    await createScrapperPage.click(`text=${label}`);
  }

  await createScrapperPage.type('[name="name"]', 'Test scrapper');
  await createScrapperPage.click('[type="submit"]');

  await repeatUntil(async () => {
    const form = await createScrapperPage.$('.scrapper-builder-form');

    expect(form).toBeTruthy();
  });

  return createScrapperPage;
}
