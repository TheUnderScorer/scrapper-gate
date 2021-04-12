import { useEffect } from 'react';
import { usePrevious } from 'react-use';
import { ContentStatePayload } from '../../browser/communication/content/contentState.types';
import { MessageTypes } from '../../browser/communication/types';
import { useMessageSender } from '../../browser/hooks/useMessageSender/useMessageSender';
import { Target } from '../../browser/hooks/useMessageSender/useMessageSender.types';
import { equals } from 'remeda';

/**
 * Used for tracking contentScript state in popup
 * */
export const useContentStateChanged = (state: ContentStatePayload | null) => {
  const prevState = usePrevious(state);
  const [send, { loading, error }] = useMessageSender({
    target: Target.background,
    type: MessageTypes.ContentStateChanged,
  });

  useEffect(() => {
    if (!equals(state, prevState)) {
      send(state).catch(console.error);
    }
  }, [send, state, prevState]);

  return {
    loading,
    error,
  };
};
