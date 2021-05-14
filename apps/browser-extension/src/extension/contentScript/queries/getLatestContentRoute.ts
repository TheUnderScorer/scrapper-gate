import { getActiveTabFromBackground } from '../../browser/tabsQuery/getActiveTabFromBackground';
import { StoredRoute } from '../../browser/communication/types';
import { browser } from 'webextension-polyfill-ts';
import { logger } from '@scrapper-gate/frontend/logger';

export const getLatestContentRoute = async (): Promise<
  StoredRoute | undefined
> => {
  const activeTab = await getActiveTabFromBackground();

  const { contentRoutes = {} } = await browser.storage.local.get([
    'contentRoutes',
  ]);

  logger.debug('Content routes:', contentRoutes);
  logger.debug('Tab', activeTab);

  if (!activeTab?.id) {
    return undefined;
  }

  return contentRoutes[activeTab.id];
};
