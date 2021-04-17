import { useGetCurrentUserQuery } from '@scrapper-gate/frontend/schema';
import { useTokensStore } from '../store/useTokensStore';
import { useDebounce } from 'react-use';

export const useIsAuthorized = () => {
  const { data, loading, refetch } = useGetCurrentUserQuery();
  const tokens = useTokensStore((store) => store.tokens);

  useDebounce(
    async () => {
      await refetch();
    },
    100,
    [tokens, refetch]
  );

  return {
    isAuthorized: Boolean(data?.me?.id),
    loading,
  };
};
