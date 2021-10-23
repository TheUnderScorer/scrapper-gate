import {
  contentScriptPathQueryKey,
  initialActiveTabUrl,
} from '@scrapper-gate/shared/routing';
import { BrowserContext } from 'playwright';

export const openContentScriptUrl = async (
  browser: BrowserContext,
  url: string,
  browserPageUrl = initialActiveTabUrl
) => {
  const page = await browser.newPage();

  const fullUrl = new URL(browserPageUrl);

  fullUrl.searchParams.append(contentScriptPathQueryKey, url);

  await page.goto(fullUrl.toString());

  return page;
};
