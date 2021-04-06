import React from 'react';
import { useGetCurrentUserQuery } from '@scrapper-gate/shared-frontend/schema';

export const Popup = () => {
  const { loading, data, error } = useGetCurrentUserQuery();

  return (
    <div>
      {loading && <span>Loading...</span>}
      {data && <span>Hello {data.me.email}</span>}
      {error && <span>{error.message}</span>}
    </div>
  );
};
