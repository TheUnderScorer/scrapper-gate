import { NoActiveTabFoundError } from '@scrapper-gate/shared/errors';
import { errorMessageResult } from './messageResult';
import { Message, MessageResult } from './messageResult.types';
import { getActiveTab } from '../tabsQuery/getActiveTab';
import { browser } from 'webextension-polyfill-ts';
import { logger } from '@scrapper-gate/frontend/logger';

export const sendMessageToTab = async <Result>(
  tabId: number,
  message: Message<unknown>
): Promise<MessageResult<Result>> => {
  logger.debug(`Sending message to tab ${tabId}:`, message);

  const response = await browser.tabs.sendMessage(tabId, message);

  logger.debug(`Message from tab ${tabId} result:`, { message, response });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response;
};

export const sendMessageToActiveTab = async <Result>(
  message: Message<unknown>
) => {
  const activeTab = await getActiveTab();

  if (!activeTab?.id) {
    return errorMessageResult<Result>(new NoActiveTabFoundError());
  }

  return sendMessageToTab<Result>(activeTab.id, message);
};
