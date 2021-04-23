/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mockzilla-webextension';
import { act, renderHook } from '@testing-library/react-hooks';
import { useMessageSender } from './useMessageSender';
import { MessageTypes } from '../../communication/types';
import { Target } from './useMessageSender.types';

describe('useMessageSender hook', () => {
  it('should send message to active tab', async () => {
    mockBrowser.tabs.query.mock(async (args) => [
      {
        id: '#tab_id',
      } as any,
    ]);

    mockBrowser.tabs.sendMessage.mock(async (tabId, message) => {
      expect(tabId).toEqual('#tab_id');
      expect(message.payload).toBeTruthy();

      return {
        payload: true,
      };
    });

    const hook = renderHook(() =>
      useMessageSender({
        target: Target.activeTab,
        type: MessageTypes.Test,
      })
    );

    const [send, { data }] = hook.result.current;
    expect(data).toBeNull();

    await act(async () => {
      await send(true);
    });

    expect(hook.result.all[1][1].loading).toEqual(true);

    expect(hook.result.current[1].data).toBeTruthy();
    expect(hook.result.current[1].called).toBeTruthy();
  });
});