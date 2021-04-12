import { browser, Tabs } from 'webextension-polyfill-ts';

export const getTabs = (
  query: Tabs.QueryQueryInfoType
): Promise<Tabs.Tab[]> => {
  return browser.tabs.query(query);
};
