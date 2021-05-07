import { getTabs } from './getTabs';
import { browser, Tabs } from 'webextension-polyfill-ts';
import { logger } from '@scrapper-gate/frontend/logger';

export const getActiveTab = async (): Promise<Tabs.Tab> => {
  const activeWindow = await browser.windows.getCurrent();

  const tabs = await getTabs({
    active: true,
    windowId: activeWindow.id,
  });

  logger.debug('Active tabs:', tabs);

  return tabs[0];
};
