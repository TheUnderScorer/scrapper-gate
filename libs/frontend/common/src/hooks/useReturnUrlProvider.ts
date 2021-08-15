import { useMemo } from 'react';
import { useLocationHref } from './useLocationHref';

export const useReturnUrlProvider = () => {
  const url = useLocationHref();

  return useMemo(() => encodeURIComponent(url), [url]);
};
