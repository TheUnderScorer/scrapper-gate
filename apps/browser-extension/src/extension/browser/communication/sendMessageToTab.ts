import { NoActiveTabFoundError } from '@scrapper-gate/shared/errors';
import { logger } from '@scrapper-gate/shared/logger/console';
import browser, { Tabs } from 'webextension-polyfill';
import { isBrowserExtensionUrl } from '../../isBrowserExtensionUrl';
import { getActiveTab } from '../tabsQuery/getActiveTab';
import { createActiveTab } from './createActiveTab';
import { errorMessageResult } from './messageResult';
import { Message, MessageResult } from './messageResult.types';

export interface SendMessageParams {
  onTabCreated?: (tab: Tabs.Tab) => unknown;
}

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
  message: Message<unknown>,
  { onTabCreated }: SendMessageParams = {}
) => {
  let activeTab: Tabs.Tab | undefined;
  let tabCreated = false;

  try {
    activeTab = await getActiveTab();
  } catch {
    activeTab = await createActiveTab();
    tabCreated = true;
  }

  if (isBrowserExtensionUrl(activeTab?.url ?? '')) {
    activeTab = await createActiveTab();
    tabCreated = true;
  }

  if (!activeTab?.id) {
    return errorMessageResult<Result>(new NoActiveTabFoundError());
  }

  if (tabCreated) {
    onTabCreated?.(activeTab);
  }

  return sendMessageToTab<Result>(activeTab.id, message);
};
