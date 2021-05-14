import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useOnMessageListener } from '../../browser/hooks/useOnMessageListener/useOnMessageListener';
import { MessageTypes } from '../../browser/communication/types';
import { useLogoutCleanup } from '@scrapper-gate/frontend/domain/auth';

export const useHandleLogoutMessage = () => {
  const history = useHistory();
  const cleanup = useLogoutCleanup();

  const handler = useCallback(async () => {
    history.push('/');

    await cleanup();
  }, [cleanup, history]);

  useOnMessageListener({
    type: MessageTypes.Logout,
    onMessage: handler,
  });
};
