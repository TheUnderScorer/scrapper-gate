import { useCallback } from 'react';
import { ContentToggleHookPayload, MessageTypes } from '../types';
import { useMessageSender } from '../../hooks/useMessageSender/useMessageSender';
import {
  MessageSenderState,
  Target,
} from '../../hooks/useMessageSender/useMessageSender.types';
import { useTokensStore } from '@scrapper-gate/frontend/domain/auth';

type Callback = (
  payload: Omit<ContentToggleHookPayload, 'tokens'>
) => Promise<void>;

/**
 * Hook for handling message that toggles contentScript in "contentScript"
 * */
export const useContentToggle = (): [Callback, MessageSenderState] => {
  const tokensVal = useTokensStore((store) => store.tokens);
  const [send, data] = useMessageSender({
    type: MessageTypes.ToggleContent,
    target: Target.activeTab,
  });

  const sendMessage = useCallback(
    async (payload: Omit<ContentToggleHookPayload, 'tokens'>) => {
      if (!tokensVal) {
        throw new TypeError('No tokens found, unable to open content overlay.');
      }

      await send({
        tokens: tokensVal,
        ...payload,
      });
    },
    [send, tokensVal]
  );

  return [sendMessage, data];
};
