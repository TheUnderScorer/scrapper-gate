import { useCallback } from 'react';
import { useTokensStore } from '../store/useTokensStore';

export const useLogout = () => {
  const setTokens = useTokensStore((store) => store.setTokens);

  return useCallback(async () => {
    setTokens(undefined);
  }, [setTokens]);
};
