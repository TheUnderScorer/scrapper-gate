import {
  MessagesPayloadMap,
  MessageTypes,
} from '../../browser/communication/types';
import { ContentStatePayload } from '../../browser/communication/content/contentState.types';
import { useOnMessageListener } from '../../browser/hooks/useOnMessageListener/useOnMessageListener';
import { sendMessageToBackground } from '../../browser/communication/sendMessageToBackground';

/**
 * Listens on contentScript state changes (ex. navigating to different route)
 * */
export const useContentStateListener = () => {
  return useOnMessageListener<
    MessageTypes.ContentStateChanged,
    MessagesPayloadMap
  >({
    type: MessageTypes.ContentStateChanged,
    initialValue: () =>
      // Send message to background in order to initially receive contentScript state
      sendMessageToBackground<ContentStatePayload>({
        type: MessageTypes.GetContentState,
      }).then((message) => message?.payload),
  });
};
