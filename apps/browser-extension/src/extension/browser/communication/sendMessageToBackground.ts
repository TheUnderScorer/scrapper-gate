import { Message, MessageResult } from './messageResult.types';
import browser from 'webextension-polyfill';
import { logger } from '@scrapper-gate/shared/logger/console';

export const sendMessageToBackground = async <Result>(
  message: Message<unknown>
): Promise<MessageResult<Result>> => {
  logger.debug('Sending message to bg', message);

  const result = await browser.runtime.sendMessage(message);

  logger.debug('Message result', { message, result });

  if (result?.error) {
    throw result.error;
  }

  return result;
};
