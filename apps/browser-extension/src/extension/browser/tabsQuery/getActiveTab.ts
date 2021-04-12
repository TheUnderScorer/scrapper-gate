import { getTabs } from './getTabs';
import { Tabs } from 'webextension-polyfill-ts';

export const getActiveTab = async (): Promise<Tabs.Tab> => {
  const [tab] = await getTabs({
    active: true,
  });

  return tab;
};
