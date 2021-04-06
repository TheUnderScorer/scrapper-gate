import { useGetCurrentUserQuery } from '@scrapper-gate/shared-frontend/schema';

export const useIsAuthorized = () => {
  const { data, loading } = useGetCurrentUserQuery();

  return {
    isAuthorized: Boolean(data?.me?.id),
    loading,
  };
};
