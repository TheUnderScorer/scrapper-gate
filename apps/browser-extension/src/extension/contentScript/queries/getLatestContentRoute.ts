import { logger } from '@scrapper-gate/shared/logger/console';
import { contentScriptPathQueryKey } from '@scrapper-gate/shared/routing';
import browser from 'webextension-polyfill';
import { StoredRoute } from '../../browser/communication/messageResult.types';
import { getCurrentTabIdFromBackground } from '../../browser/tabsQuery/getCurrentTabIdFromBackground';

export const getLatestContentRoute = async (): Promise<
  StoredRoute | undefined
> => {
  const activeTabId = await getCurrentTabIdFromBackground();

  const routeFromQuery = new URLSearchParams(document.location.search).get(
    contentScriptPathQueryKey
  );

  if (routeFromQuery) {
    const [pathname, search] = routeFromQuery.split('?');

    logger.debug('Got route from query:', {
      pathname,
      search,
      routeFromQuery,
    });

    return {
      search,
      pathname,
    };
  }

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
