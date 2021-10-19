import { logger } from '@scrapper-gate/shared/logger/console';
import browser from 'webextension-polyfill';
import { Message, MessageResult } from './messageResult.types';

export const sendMessageToBackground = async <Result>(
  message: Message<unknown>
): Promise<MessageResult<Result>> => {
  logger.debug('Sending message to bg', message);

  const response = await browser.runtime.sendMessage(message);

  logger.debug(`Message ${message.type} result`, { message, response });

  if (response?.error) {
    throw response.error;
  }

  return response;
};
