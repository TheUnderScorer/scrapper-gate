import 'mockzilla-webextension';
import { renderHook } from '@testing-library/react-hooks';
import { useOnMessageListener } from './useOnMessageListener';
import {
  MessagesPayloadMap,
  MessageTypes,
} from '../../communication/messageResult.types';

describe('useOnMessageListener hook', () => {
  beforeEach(() => {
    mockBrowser.runtime.onMessage.addListener.mock((callback) => {
      callback(
        {
          type: MessageTypes.Test,
          payload: true,
        },
        {}
      );
    });

    mockBrowser.runtime.onMessage.removeListener.mock(jest.fn());
  });

  it('should subscribe to message payload', () => {
    const { result } = renderHook(() =>
      useOnMessageListener<MessageTypes.Test, MessagesPayloadMap>({
        type: MessageTypes.Test,
      })
    );

    expect(result.current).toBeTruthy();
  });
});
