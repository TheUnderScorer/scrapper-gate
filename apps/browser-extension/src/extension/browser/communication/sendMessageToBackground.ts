import { Message, MessageResult } from './types';
import { browser } from 'webextension-polyfill-ts';

export const sendMessageToBackground = async <Result>(
  message: Message<unknown>
): Promise<MessageResult<Result>> => {
  const result = await browser.runtime.sendMessage(message);

  if (result.error) {
    throw result.error;
  }

  return result;
};
