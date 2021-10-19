import { first, repeatUntil } from '@scrapper-gate/shared/common';
import { NoActiveTabFoundError } from '@scrapper-gate/shared/errors';
import { logger } from '@scrapper-gate/shared/logger/console';
import { getTabs } from './getTabs';
import { Tabs } from 'webextension-polyfill';

export const getActiveTab = async (): Promise<Tabs.Tab> => {
  const tabs = await repeatUntil(
    () =>
      getTabs({
        active: true,
        currentWindow: true,
      }),
    (result) => result && result.length > 0
  );

  logger.debug('Active tabs:', tabs);

  if (!tabs.length) {
    throw new NoActiveTabFoundError();
  }

  return first(tabs);
};
