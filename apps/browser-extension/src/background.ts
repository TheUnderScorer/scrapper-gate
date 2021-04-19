/* eslint-disable no-console */
import 'reflect-metadata';
// For fallback `tabs.executeScript`
import 'webpack-target-webextension/lib/background';
import { handlers } from './extension/background/messageHandlers/handlers';
import { Message, MessageTypes } from './extension/browser/communication/types';
import { contentStateStore } from './extension/background/store/contentStateStore';
import { browserLocalStorage } from './extension/localStorage/browserLocalStorage';
import { browser } from 'webextension-polyfill-ts';

browser.runtime.onMessage.addListener(
  async (message: Message<MessageTypes>, sender) => {
    console.log('Received message:', message);

    if (handlers[message.type]) {
      const handler = handlers[message.type];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await handler(message as any, sender);

      console.log(`Response for message ${message.type}: `, response);

      return response;
    }
  }
);

browser.tabs.onRemoved.addListener(async (tabId) => {
  if (contentStateStore.has(tabId)) {
    contentStateStore.delete(tabId);
  }

  const {
    contentRoutes = {},
    activeOverlays = [],
  } = await browserLocalStorage.get(['contentRoutes', 'activeOverlays']);

  if (Array.isArray(activeOverlays) && activeOverlays?.length) {
    const newActiveOverlay = [...activeOverlays].filter(
      (overlayTabId) => overlayTabId !== tabId
    );

    await browserLocalStorage.set('activeOverlays', newActiveOverlay);
  }

  if (contentRoutes && Array.isArray(contentRoutes)) {
    const newContentRoutes = {
      ...contentRoutes,
    };

    delete newContentRoutes[tabId];

    await browserLocalStorage.set('contentRoutes', newContentRoutes);
  }

  console.log(`${tabId} data cleaned.`);
});
