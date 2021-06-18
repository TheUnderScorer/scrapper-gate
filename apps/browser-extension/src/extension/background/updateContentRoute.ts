import { browser, Tabs } from 'webextension-polyfill-ts';
import { StoredRoute } from '../browser/communication/messageResult.types';
import { getActiveTab } from '../browser/tabsQuery/getActiveTab';

export const updateContentRoute = async (
  route?: StoredRoute,
  tab?: Tabs.Tab
) => {
  const targetTab = tab ?? (await getActiveTab());
  const { contentRoutes = {} } = await browser.storage.local.get([
    'contentRoutes',
  ]);

  if (typeof contentRoutes !== 'object' || !targetTab || !targetTab?.id) {
    return;
  }

  contentRoutes[targetTab.id] = route;

  await browser.storage.local.set({
    contentRoutes,
  });
};
