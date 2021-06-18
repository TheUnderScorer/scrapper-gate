import { browser } from 'webextension-polyfill-ts';
import { cleanupStoresForTab } from './cleanupStoresForTab';

export const cleanupOnInit = async () => {
  const {
    contentRoutes = {},
    activeOverlays = [],
  } = await browser.storage.local.get(['contentRoutes', 'activeOverlays']);

  const tabs = await browser.tabs.query({});

  await Promise.all(
    tabs
      .filter((tab) => tab.id)
      .map((tab) =>
        cleanupStoresForTab({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          tabId: tab.id!,
          activeOverlays,
          contentRoutes,
        })
      )
  );
};
