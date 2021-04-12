import { Message, MessageResult } from './types';
import { getActiveTab } from '../tabsQuery/getActiveTab';
import { browser } from 'webextension-polyfill-ts';

export const sendMessageToTab = async <Result>(
  tabId: number,
  message: Message<unknown>
): Promise<MessageResult<Result>> => {
  const response = await browser.tabs.sendMessage(tabId, message);

  if (response.error) {
    throw response.error;
  }

  return response;
};

export const sendMessageToActiveTab = async <Result>(
  message: Message<unknown>
) => {
  const activeTab = await getActiveTab();

  return sendMessageToTab<Result>(activeTab.id, message);
};
