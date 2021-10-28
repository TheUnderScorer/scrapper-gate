import { wait } from '@scrapper-gate/shared/common';
import { initialActiveTabUrl } from '@scrapper-gate/shared/routing';
import browser from 'webextension-polyfill';

export async function createActiveTab(queryParams?: URLSearchParams) {
  const url = new URL(initialActiveTabUrl);

  if (queryParams) {
    queryParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  url.searchParams.set('sg', '1');

  const activeTab = await browser.tabs.create({
    // TODO Replace with scrapper gate landing page url
    url: url.toString(),
  });

  await browser.tabs.highlight({
    tabs: activeTab.index,
  });

  await wait(1500);

  return activeTab;
}
