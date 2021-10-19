import { useCallback } from 'react';
import {
  ContentToggleHookPayload,
  MessageResult,
  MessageTypes,
  ToggleContentResult,
} from '../messageResult.types';
import { useMessageSender } from '../../hooks/useMessageSender/useMessageSender';
import {
  MessageSenderState,
  Target,
} from '../../hooks/useMessageSender/useMessageSender.types';
import { useTokensStore } from '@scrapper-gate/frontend/domain/auth';

export type ToggleContentParams = Omit<ContentToggleHookPayload, 'tokens'>;

type Callback = (
  payload: ToggleContentParams
) => Promise<MessageResult<ToggleContentResult> | null>;

/**
 * Hook for handling message that toggles contentScript
 * */
export const useContentToggle = (): [Callback, MessageSenderState] => {
  const tokensVal = useTokensStore((store) => store.tokens);
  const [send, data] = useMessageSender<
    MessageTypes.ToggleContent,
    ToggleContentResult
  >({
    type: MessageTypes.ToggleContent,
    target: Target.background,
  });

  const sendMessage = useCallback(
    async (payload: ToggleContentParams) => {
      if (!tokensVal) {
        throw new TypeError('No tokens found, unable to open content overlay.');
      }

      return send({
        tokens: tokensVal,
        ...payload,
      });
    },
    [send, tokensVal]
  );

  return [sendMessage, data];
};
