import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

export const useLogoutCleanup = () => {
  const client = useApolloClient();

  return useCallback(async () => {
    console.log('Cleanup...');

    await client.resetStore();

    console.log('Cleanup done.');
  }, [client]);
};
