import { getActiveTab } from '../browser/tabsQuery/getActiveTab';
import { browserLocalStorage } from '../localStorage/browserLocalStorage';
import { Tabs } from 'webextension-polyfill-ts';
import { uniq } from 'remeda';

export const toggleContentOverlay = async (active: boolean, tab?: Tabs.Tab) => {
  const targetTab = tab ?? (await getActiveTab());
  let { activeOverlays } = await browserLocalStorage.get(['activeOverlays']);

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

  await browserLocalStorage.set('activeOverlays', uniq(newActiveOverlays));
};
