import { wait } from '@scrapper-gate/shared/common';
import { browser } from 'webextension-polyfill-ts';

export const initialActiveTabUrl = 'https://www.google.com';

export async function createActiveTab() {
  const activeTab = await browser.tabs.create({
    // TODO Replace with scrapper gate landing page url
    url: initialActiveTabUrl,
  });

  await browser.tabs.highlight({
    tabs: activeTab.index,
  });

  await wait(750);

  return activeTab;
}
