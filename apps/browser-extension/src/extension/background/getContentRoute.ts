import browser from 'webextension-polyfill';
import { StoredRoute } from '../browser/communication/messageResult.types';

export const getContentRoute = async (
  tabId: number | string
): Promise<StoredRoute | undefined> => {
  const { contentRoutes = {} } = await browser.storage.local.get([
    'contentRoutes',
  ]);

  return contentRoutes[tabId];
};
