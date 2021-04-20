import { getActiveTab } from '../browser/tabsQuery/getActiveTab';
import { browser, Tabs } from 'webextension-polyfill-ts';
import { uniq } from 'remeda';

export const toggleContentOverlay = async (active: boolean, tab?: Tabs.Tab) => {
  const targetTab = tab ?? (await getActiveTab());
  let { activeOverlays } = await browser.storage.local.get(['activeOverlays']);

  if (!Array.isArray(activeOverlays)) {
    activeOverlays = [];
  }

  let newActiveOverlays = [...((activeOverlays as unknown[]) ?? [])];

  if (active) {
    newActiveOverlays.push(targetTab.id);
  } else {
    newActiveOverlays = newActiveOverlays.filter(
      (tabId) => tabId !== targetTab.id
    );
  }

  await browser.storage.local.set({
    activeOverlays: uniq(newActiveOverlays),
  });
};
