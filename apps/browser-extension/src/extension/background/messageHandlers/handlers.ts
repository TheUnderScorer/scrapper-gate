import { successMessageResult } from '../../browser/communication/messageResult';
import {
  HandlersMap,
  MessageTypes,
  StoredRoute,
} from '../../browser/communication/messageResult.types';
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
    await sendMessageToActiveTab(message, {
      /**
       * If new tab was created the message won't reach it, so we will just update content routes for this tab, and after opening it content will *magically* open!
       * */
      onTabCreated: (tab) => {
        if (message.payload?.path && message.payload?.visible) {
          updateContentRoute(
            {
              pathname: message.payload.path,
              search: '',
            },
            tab
          );
        }
      },
    });

    return {
      result: true,
    };
  },
  [MessageTypes.GetContentRoute]: async () => {
    const result = await sendMessageToActiveTab<StoredRoute | undefined>({
      type: MessageTypes.GetContentRoute,
    });

    return successMessageResult(result.payload);
  },
  [MessageTypes.GetActiveTab]: async () =>
    successMessageResult(await getActiveTab()),
  [MessageTypes.Logout]: async () => {
    await sendMessageToActiveTab({
      type: MessageTypes.Logout,
    });

    return successMessageResult();
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
