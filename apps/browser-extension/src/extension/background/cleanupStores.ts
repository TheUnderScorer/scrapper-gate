import browser from 'webextension-polyfill';

export const cleanupStores = async () => {
  await browser.storage.local.get(['contentRoutes', 'activeOverlays']);
};
