import { useEffect, useState } from 'react';
import {
  Message,
  MessageResult,
  MessageTypes,
} from '../../communication/types';
import { browser, Runtime } from 'webextension-polyfill-ts';

interface OnMessageListenerHookProps<
  Type extends keyof TypesMap,
  TypesMap extends Record<string, unknown>
> {
  type: MessageTypes;
  initialValue?: () => Promise<TypesMap[Type] | null>;
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
}: OnMessageListenerHookProps<Type, TypesMap>): TypesMap[Type] | null => {
  const [initialValueResolved, setInitialValueResolved] = useState(false);

  const [value, setValue] = useState<TypesMap[Type] | null>(null);

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
        return;
      }

      setValue(message.payload);

      if (onMessage) {
        onMessage(message);
      }

      if (responseSender) {
        return responseSender(message, sender);
      }
    };

    browser.runtime.onMessage.addListener(listener);

    return () => {
      browser.runtime.onMessage.removeListener(listener);
    };
  }, [type, responseSender, onMessage]);

  return value;
};
