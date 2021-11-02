import { isError } from '@scrapper-gate/shared/common';
import { useCallback, useState } from 'react';
import {
  MessagesPayloadMap,
  MessageTypes,
} from '../../communication/messageResult.types';
import {
  MessageSenderHookProps,
  MessageSenderResult,
  Target,
} from './useMessageSender.types';
import { sendMessageToActiveTab } from '../../communication/sendMessageToTab';
import { sendMessageToBackground } from '../../communication/sendMessageToBackground';
import { logger } from '@scrapper-gate/shared/logger/console';

export const useMessageSender = <Type extends MessageTypes, Data = unknown>({
  target,
  type,
}: MessageSenderHookProps<Type>): MessageSenderResult<Type, Data> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [called, setCalled] = useState(false);

  const send = useCallback(
    async (payload?: MessagesPayloadMap[Type]) => {
      logger.debug(`Sending message ${type}:`, payload);

      setLoading(true);
      setCalled(true);

      const caller =
        target === Target.activeTab
          ? sendMessageToActiveTab
          : sendMessageToBackground;

      try {
        const response = await caller<Data>({
          type,
          payload,
        });

        logger.debug(`Message ${type} response:`, response);

        setError(null);
        setData(response?.payload ?? null);

        return response;
      } catch (e) {
        if (isError(e)) {
          logger.error(`Message ${type} error:`, e);

          setError(e);
        }
        setData(null);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [target, type]
  );

  return [
    send,
    {
      data,
      loading,
      error,
      called,
    },
  ];
};
