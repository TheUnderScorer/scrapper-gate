import { logger } from '@scrapper-gate/shared/logger/console';
import browser from 'webextension-polyfill';
import { StoredRoute } from '../../browser/communication/messageResult.types';
import { getCurrentTabIdFromBackground } from '../../browser/tabsQuery/getCurrentTabIdFromBackground';

export const getLatestContentRoute = async (): Promise<
  StoredRoute | undefined
> => {
  const activeTabId = await getCurrentTabIdFromBackground();

  const { contentRoutes = {} } = await browser.storage.local.get([
    'contentRoutes',
  ]);

  logger.debug('Content routes:', contentRoutes);
  logger.debug('Tab id', activeTabId);

  if (!activeTabId) {
    return;
  }

  const route = contentRoutes[activeTabId];

  logger.debug('Initial content route:', route);

  return route;
};
