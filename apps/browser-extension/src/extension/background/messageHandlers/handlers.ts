import { HandlersMap, MessageTypes } from '../../browser/communication/types';
import { getActiveTab } from '../../browser/tabsQuery/getActiveTab';
import { toggleContentOverlay } from '../toggleContentOverlay';
import { updateContentRoute } from '../updateContentRoute';
import { sendMessageToActiveTab } from '../../browser/communication/sendMessageToTab';

export const handlers: HandlersMap = {
  [MessageTypes.ScrapperOverlayToggled]: async (message) => {
    const activeTab = await getActiveTab();

    await toggleContentOverlay(Boolean(message.payload), activeTab);

    return {
      result: true,
      payload: message.payload,
    };
  },
  [MessageTypes.ContentRouteChanged]: async (message, sender) => {
    await updateContentRoute(message.payload, sender.tab);

    return {
      result: true,
      payload: message.payload,
    };
  },
  [MessageTypes.ToggleContent]: async (message) => {
    await sendMessageToActiveTab(message);

    return {
      result: true,
    };
  },
  [MessageTypes.GetActiveTab]: async () => ({
    result: true,
    payload: await getActiveTab(),
  }),
  [MessageTypes.Logout]: async () => {
    await sendMessageToActiveTab({
      type: MessageTypes.Logout,
    });

    return {
      result: true,
    };
  },
  [MessageTypes.InjectContentScript]: async (message, sender) => {
    if (!sender.tab?.id) {
      return;
    }

    chrome.scripting.executeScript({
      files: ['contentRoot.js'],
      target: {
        tabId: sender.tab.id,
      },
    });
  },
};
