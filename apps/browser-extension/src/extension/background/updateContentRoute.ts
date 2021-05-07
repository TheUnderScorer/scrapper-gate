import { getActiveTab } from '../browser/tabsQuery/getActiveTab';
import { browser, Tabs } from 'webextension-polyfill-ts';
import { StoredRoute } from '../browser/communication/types';
import { getTabId } from '../browser/getTabId';

export const updateContentRoute = async (
  route: StoredRoute,
  tab?: Tabs.Tab
) => {
  const targetTab = tab ?? (await getActiveTab());
  const { contentRoutes = {} } = await browser.storage.local.get([
    'contentRoutes',
  ]);

  if (typeof contentRoutes !== 'object' || !targetTab) {
    return;
  }

  const tabId = getTabId(targetTab);

  contentRoutes[tabId] = route;

  await browser.storage.local.set({
    contentRoutes,
  });
};
