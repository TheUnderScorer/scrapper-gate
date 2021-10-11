import { sendMessageToBackground } from '../communication/sendMessageToBackground';
import { MessageTypes } from '../communication/messageResult.types';
import { Tabs } from 'webextension-polyfill';

export const getActiveTabFromBackground = async () => {
  const response = await sendMessageToBackground<Tabs.Tab>({
    type: MessageTypes.GetActiveTab,
  });

  return response?.payload ?? null;
};
