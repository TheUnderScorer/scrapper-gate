import { sendMessageToBackground } from '../../browser/communication/sendMessageToBackground';
import { MessageTypes } from '../../browser/communication/types';
import { Tabs } from 'webextension-polyfill-ts';

export const getActiveTabInContent = async () => {
  const response = await sendMessageToBackground<Tabs.Tab>({
    type: MessageTypes.GetActiveTab,
  });

  return response?.payload ?? null;
};
