import { first } from '@scrapper-gate/shared/common';
import { NoActiveTabFoundError } from '@scrapper-gate/shared/errors';
import { getTabs } from './getTabs';
import { Tabs } from 'webextension-polyfill-ts';
import { logger } from '@scrapper-gate/frontend/logger';

export const getActiveTab = async (): Promise<Tabs.Tab> => {
  const tabs = await getTabs({
    active: true,
    currentWindow: true,
  });

  logger.debug('Active tabs:', tabs);

  if (!tabs.length) {
    throw new NoActiveTabFoundError();
  }

  return first(tabs);
};
