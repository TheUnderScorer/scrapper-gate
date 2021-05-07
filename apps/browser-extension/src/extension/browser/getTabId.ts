import { Tabs } from 'webextension-polyfill-ts';

export const getTabId = (tab: Tabs.Tab) => `${tab.id}-${tab.windowId}`;
