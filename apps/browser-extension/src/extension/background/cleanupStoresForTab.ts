import { StoredRoutes } from '../browser/communication/messageResult.types';
import { browser } from 'webextension-polyfill-ts';
import { logger } from '@scrapper-gate/shared/logger/console';

interface CleanupStoresForTabParams {
  tabId: number | string;
  contentRoutes: StoredRoutes;
  activeOverlays: number[];
}

export const cleanupStoresForTab = async ({
  tabId,
  contentRoutes,
  activeOverlays,
}: CleanupStoresForTabParams) => {
  if (Array.isArray(activeOverlays) && activeOverlays?.length) {
    const newActiveOverlay = [...activeOverlays].filter(
      (overlayTabId) => overlayTabId !== tabId
    );

    await browser.storage.local.set({
      activeOverlays: newActiveOverlay,
    });
  }

  if (contentRoutes && Array.isArray(contentRoutes)) {
    const newContentRoutes = {
      ...contentRoutes,
    };

    delete newContentRoutes[tabId];

    await browser.storage.local.set({
      contentRoutes: newContentRoutes,
    });
  }

  logger.debug(`Tab ${tabId} data cleaned.`);
};
