import { useCallback } from 'react';
import { UseTokenStoreHook } from '../store/useTokensStore';

export const useLogout = (useTokensStore: UseTokenStoreHook) => {
  const setTokens = useTokensStore((store) => store.setTokens);

  return useCallback(async () => {
    setTokens(undefined);
  }, [setTokens]);
};
