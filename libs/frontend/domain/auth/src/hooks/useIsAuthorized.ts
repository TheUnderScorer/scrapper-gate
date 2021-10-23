import { useGetCurrentUserQuery } from '@scrapper-gate/frontend/schema';
import { useDebounce } from 'react-use';
import { UseTokenStoreHook } from '../store/useTokensStore';

export const useIsAuthorized = (useTokensStore: UseTokenStoreHook) => {
  const { data, loading, refetch } = useGetCurrentUserQuery();
  const tokens = useTokensStore((store) => store.tokens);

  useDebounce(
    async () => {
      await refetch();
    },
    500,
    [tokens, refetch]
  );

  return {
    isAuthorized: Boolean(data?.me?.id),
    loading,
  };
};
