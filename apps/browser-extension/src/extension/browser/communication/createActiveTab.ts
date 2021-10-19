import { wait } from '@scrapper-gate/shared/common';
import { initialActiveTabUrl } from '@scrapper-gate/shared/routing';
import browser from 'webextension-polyfill';

export async function createActiveTab() {
  const activeTab = await browser.tabs.create({
    // TODO Replace with scrapper gate landing page url
    url: initialActiveTabUrl,
  });

  await browser.tabs.highlight({
    tabs: activeTab.index,
  });

  await wait(1500);

  return activeTab;
}
