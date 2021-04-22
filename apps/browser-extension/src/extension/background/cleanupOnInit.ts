import { browser } from 'webextension-polyfill-ts';
import { cleanupStoresForTab } from './cleanupStoresForTab';

export const cleanupOnInit = async () => {
  const {
    contentRoutes = {},
    activeOverlays = [],
  } = await browser.storage.local.get(['contentRoutes', 'activeOverlays']);

  const tabs = await browser.tabs.query({});

  await Promise.all(
    tabs.map((tab) =>
      cleanupStoresForTab({
        tabId: tab.id,
        activeOverlays,
        contentRoutes,
      })
    )
  );
};
