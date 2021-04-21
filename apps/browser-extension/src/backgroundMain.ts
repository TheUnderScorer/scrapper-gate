/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from 'webextension-polyfill-ts';
import { handlers } from './extension/background/messageHandlers/handlers';
import { Message, MessageTypes } from './extension/browser/communication/types';
import { logger } from '@scrapper-gate/frontend/logger';

logger.debug('Background script started');

browser.runtime.onMessage.addListener(
  async (message: Message<MessageTypes>, sender) => {
    logger.debug('Received message:', message);

    if (handlers[message.type]) {
      const handler = handlers[message.type];
      const response = await handler(message as any, sender);

      logger.debug(`Response for message ${message.type}: `, response);

      return response;
    }

    return true;
  }
);

browser.tabs.onRemoved.addListener(async (tabId) => {
  const {
    contentRoutes = {},
    activeOverlays = [],
  } = await browser.storage.local.get(['contentRoutes', 'activeOverlays']);

  if (Array.isArray(activeOverlays) && activeOverlays?.length) {
    const newActiveOverlay = [...activeOverlays].filter(
      (overlayTabId) => overlayTabId !== tabId
    );

    await browser.storage.local.set({
      activeOverlays: newActiveOverlay,
    });
  }

  if (contentRoutes && Array.isArray(contentRoutes)) {
    const newContentRoutes = {
      ...contentRoutes,
    };

    delete newContentRoutes[tabId];

    await browser.storage.local.set({
      contentRoutes: newContentRoutes,
    });
  }

  logger.debug(`Tab ${tabId} data cleaned.`);
});
