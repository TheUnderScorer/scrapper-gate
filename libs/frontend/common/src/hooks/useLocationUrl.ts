import { useLocation } from 'react-router-dom';

export const useLocationUrl = () => {
  const location = useLocation();

  return `${location.pathname}${location.search}`;
};
