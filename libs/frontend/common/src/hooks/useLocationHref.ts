import { useLocation } from 'react-router-dom';

/**
 * Provides location pathname with search query
 * */
export const useLocationHref = () => {
  const location = useLocation();

  return `${location.pathname}${location.search}`;
};
