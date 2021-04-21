import { getActiveTabFromBackground } from '../../browser/tabsQuery/getActiveTabFromBackground';
import { StoredRoute } from '../../browser/communication/types';
import { browser } from 'webextension-polyfill-ts';

export const getLatestContentRoute = async (): Promise<
  StoredRoute | undefined
> => {
  const activeTab = await getActiveTabFromBackground();

  const { contentRoutes = {} } = await browser.storage.local.get([
    'contentRoutes',
  ]);

  if (!activeTab?.id) {
    return undefined;
  }

  return contentRoutes[activeTab.id];
};
