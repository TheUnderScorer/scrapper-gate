import { HandlersMap, MessageTypes } from '../../browser/communication/types';
import { getActiveTab } from '../../browser/tabsQuery/getActiveTab';
import { toggleContentOverlay } from '../toggleContentOverlay';
import { updateContentRoute } from '../updateContentRoute';
import { contentStateStore } from '../store/contentStateStore';
import { sendMessageToActiveTab } from '../../browser/communication/sendMessageToTab';
import { browser } from 'webextension-polyfill-ts';

export const handlers: HandlersMap = {
  [MessageTypes.ScrapperOverlayToggled]: async (message) => {
    const activeTab = await getActiveTab();

    await toggleContentOverlay(Boolean(message.payload), activeTab);

    return {
      result: true,
      payload: message.payload,
    };
  },
  [MessageTypes.ContentRouteChanged]: async (message) => {
    await updateContentRoute(message.payload);

    return {
      result: true,
      payload: message.payload,
    };
  },
  [MessageTypes.GetActiveTab]: async () => ({
    result: true,
    payload: await getActiveTab(),
  }),
  [MessageTypes.ContentStateChanged]: async (message) => {
    const tabId = message.payload?.tabId ?? (await getActiveTab()).id;
    contentStateStore.set(tabId, message.payload);
  },
  [MessageTypes.GetContentState]: async (message) => {
    const tabId = message.payload?.tabId ?? (await getActiveTab()).id;
    const state = contentStateStore.get(tabId);

    return {
      result: true,
      payload: state,
    };
  },
  [MessageTypes.Logout]: async () => {
    await sendMessageToActiveTab({
      type: MessageTypes.Logout,
    });

    return {
      result: true,
    };
  },
  [MessageTypes.InjectContent]: async (message, sender) => {
    if (!sender.tab?.id) {
      return;
    }

    console.log('Injecting content script...', chrome.scripting);

    chrome.scripting.executeScript({
      files: ['contentRoot.js'],
      target: {
        tabId: sender.tab.id,
      },
    });
  },
};
