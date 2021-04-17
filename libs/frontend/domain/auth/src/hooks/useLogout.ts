import { useTokensStore } from '@scrapper-gate/frontend/domain/auth';
import { useCallback } from 'react';

export const useLogout = () => {
  const setTokens = useTokensStore((store) => store.setTokens);

  return useCallback(async () => {
    setTokens(undefined);
  }, [setTokens]);
};
