import { getActiveTabFromBackground } from '../../browser/tabsQuery/getActiveTabFromBackground';
import browser from 'webextension-polyfill';

export const wasScrapperOverlayOpened = async () => {
  const activeTab = await getActiveTabFromBackground();
  const { activeOverlays = [] } = await browser.storage.local.get([
    'activeOverlays',
  ]);

  return (
    Array.isArray(activeOverlays) && activeOverlays?.includes(activeTab?.id)
  );
};
