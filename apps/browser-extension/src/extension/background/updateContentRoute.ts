import { getActiveTab } from '../browser/tabsQuery/getActiveTab';
import { browserLocalStorage } from '../localStorage/browserLocalStorage';
import { Tabs } from 'webextension-polyfill-ts';
import { StoredRoute } from '../browser/communication/types';

export const updateContentRoute = async (
  route: StoredRoute,
  tab?: Tabs.Tab
) => {
  const targetTab = tab ?? (await getActiveTab());
  const { contentRoutes = {} } = await browserLocalStorage.get([
    'contentRoutes',
  ]);

  if (typeof contentRoutes !== 'object') {
    return;
  }

  const newContentRoutes = {
    ...(contentRoutes ?? {}),
    [targetTab.id]: route,
  };

  await browserLocalStorage.set('contentRoutes', newContentRoutes);
};
