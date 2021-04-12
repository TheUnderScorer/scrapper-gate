import { useCallback, useState } from 'react';
import { MessagesPayloadMap, MessageTypes } from '../../communication/types';
import {
  MessageSenderHookProps,
  MessageSenderResult,
  Target,
} from './useMessageSender.types';
import { sendMessageToActiveTab } from '../../communication/sendMessageToTab';
import { sendMessageToBackground } from '../../communication/sendMessageToBackground';

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
      setLoading(true);
      setCalled(true);

      switch (target) {
        case Target.activeTab: {
          try {
            const response = await sendMessageToActiveTab<Data>({
              type,
              payload,
            });

            setError(null);
            setData(response?.payload ?? null);
          } catch (e) {
            setError(e);
            setData(null);
          } finally {
            setLoading(false);
          }

          break;
        }

        case Target.background:
          try {
            const response = await sendMessageToBackground<Data>({
              type,
              payload,
            });

            setError(null);
            setData(response?.payload ?? null);
          } catch (e) {
            setError(e);
            setData(null);
          } finally {
            setLoading(false);
          }
          break;

        default:
          setLoading(false);
          throw new Error('Invalid type provided.');
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
