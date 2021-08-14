import { useLocationUrl } from '@scrapper-gate/frontend/common';
import { useMemo } from 'react';

export const useReturnUrlProvider = () => {
  const url = useLocationUrl();

  return useMemo(() => encodeURIComponent(url), [url]);
};
