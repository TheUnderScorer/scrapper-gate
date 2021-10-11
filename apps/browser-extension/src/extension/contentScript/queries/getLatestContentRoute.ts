import { getActiveTabFromBackground } from '../../browser/tabsQuery/getActiveTabFromBackground';
import { StoredRoute } from '../../browser/communication/messageResult.types';
import browser from 'webextension-polyfill';
import { logger } from '@scrapper-gate/shared/logger/console';

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

  const route = contentRoutes[activeTab.id];

  logger.debug('Initial content route:', route);

  return route;
};
