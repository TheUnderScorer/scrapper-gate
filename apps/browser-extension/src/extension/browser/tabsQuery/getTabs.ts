import browser, { Tabs } from 'webextension-polyfill';

export const getTabs = (
  query: Tabs.QueryQueryInfoType
): Promise<Tabs.Tab[]> => {
  return browser.tabs.query(query);
};
