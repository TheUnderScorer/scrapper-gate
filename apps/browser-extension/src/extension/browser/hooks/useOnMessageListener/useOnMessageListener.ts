import { Perhaps } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import { useEffect, useState } from 'react';
import browser, { Runtime } from 'webextension-polyfill';
import {
  Message,
  MessageResult,
  MessageTypes,
} from '../../communication/messageResult.types';

interface OnMessageListenerHookProps<
  Type extends keyof TypesMap,
  TypesMap extends Record<string, unknown>
> {
  type: MessageTypes;
  initialValue?: () => Promise<Perhaps<TypesMap[Type]>>;
  sendResponse?: (
    message: Message<Type, TypesMap[Type]>,
    sender: Runtime.MessageSender
  ) => MessageResult<unknown>;
  onMessage?: (message: Message<Type, TypesMap[Type]>) => unknown;
}

export const useOnMessageListener = <
  Type extends keyof TypesMap,
  TypesMap extends Record<string, unknown> = Record<string, unknown>
>({
  type,
  initialValue,
  sendResponse: responseSender,
  onMessage,
}: OnMessageListenerHookProps<Type, TypesMap>): Perhaps<TypesMap[Type]> => {
  const [initialValueResolved, setInitialValueResolved] = useState(false);

  const [value, setValue] = useState<Perhaps<TypesMap[Type]>>(null);

  useEffect(() => {
    if (initialValue && !initialValueResolved) {
      setInitialValueResolved(true);
      initialValue().then((val) => {
        setValue(val);
      });
    }
  }, [initialValue, initialValueResolved]);

  useEffect(() => {
    const listener = async (
      message: Message<Type, TypesMap[Type]>,
      sender: Runtime.MessageSender
    ) => {
      if (message.type !== type) {
        return true;
      }

      logger.debug(`Received message: `, message);

      setValue(message.payload);

      if (onMessage) {
        onMessage(message);
      }

      if (responseSender) {
        const response = responseSender(message, sender);

        logger.debug(`Message ${message.type} response:`, response);

        return response;
      }

      return true;
    };

    browser.runtime.onMessage.addListener(listener);

    return () => {
      browser.runtime.onMessage.removeListener(listener);
    };
  }, [type, responseSender, onMessage]);

  return value;
};
