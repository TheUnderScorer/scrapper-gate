import { MessageTypes } from '../communication/messageResult.types';
import { sendMessageToBackground } from '../communication/sendMessageToBackground';

export const getCurrentTabIdFromBackground = async () => {
  const result = await sendMessageToBackground<number>({
    type: MessageTypes.GetActiveTabId,
  });

  return result?.payload;
};
