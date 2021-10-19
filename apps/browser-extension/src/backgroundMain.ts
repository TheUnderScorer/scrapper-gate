/* eslint-disable @typescript-eslint/no-explicit-any */
import browser from 'webextension-polyfill';
import { handlers } from './extension/background/messageHandlers/handlers';
import {
  Message,
  MessageTypes,
} from './extension/browser/communication/messageResult.types';
import { logger } from '@scrapper-gate/shared/logger/console';
import { cleanupStoresForTab } from './extension/background/cleanupStoresForTab';
import { cleanupOnInit } from './extension/background/cleanupOnInit';

logger.debug('Background script started');

browser.runtime.onMessage.addListener(
  async (message: Message<MessageTypes>, sender) => {
    logger.debug('Received message:', message);

    if (handlers[message.type]) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const handler = handlers[message.type]!;
      const response = await handler(message as any, sender);

      logger.debug(`Response for message ${message.type}: `, response);

      return response;
    }

    logger.debug(`No handlers found for message type: ${message.type}`);

    return {
      result: false,
    };
  }
);

browser.runtime.onInstalled.addListener(() => {
  cleanupOnInit()
    .then(() => logger.debug('Cleanup on init done.'))
    .catch((err) => logger.error('Cleanup on init failed:', err));
});

browser.tabs.onRemoved.addListener(async (tabId) => {
  const { contentRoutes = {}, activeOverlays = [] } =
    await browser.storage.local.get(['contentRoutes', 'activeOverlays']);

  await cleanupStoresForTab({
    tabId,
    contentRoutes,
    activeOverlays,
  });
});
