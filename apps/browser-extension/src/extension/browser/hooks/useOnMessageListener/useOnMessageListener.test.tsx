import { renderHook } from '@testing-library/react-hooks';
import { atom, RecoilRoot, useRecoilValue } from 'recoil';
import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import { useOnMessageListener } from './useOnMessageListener';
import { MessagesPayloadMap, MessageTypes } from '../../communication/types';

describe('useOnMessageListener hook', () => {
  beforeEach(() => {
    (chrome.runtime.onMessage.addListener as jest.Mock).mockClear();

    (chrome.runtime.onMessage.addListener as jest.Mock).mockImplementation(
      (callback) => {
        callback({
          type: MessageTypes.Test,
          payload: true,
        });
      }
    );
  });

  it('should subscribe to message payload', () => {
    const { result } = renderHook(() =>
      useOnMessageListener<MessageTypes.Test, MessagesPayloadMap>({
        type: MessageTypes.Test,
      })
    );

    expect(result.current).toBeTruthy();
  });

  it('should handle atom state', () => {
    return new Promise<void>((done) => {
      const state = atom<boolean | null>({
        key: 'test',
        default: false,
      });

      const Component = () => {
        const value = useRecoilValue(state);

        const hookValue = useOnMessageListener<
          MessageTypes.Test,
          MessagesPayloadMap
        >({
          type: MessageTypes.Test,
          useRecoilState: state as any,
        });

        useEffect(() => {
          if (hookValue && value) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(value).toBeTruthy();

            done();
          }
        }, [hookValue, value]);

        return null;
      };

      render(
        <RecoilRoot>
          <Component />
        </RecoilRoot>
      );
    });
  });
});
