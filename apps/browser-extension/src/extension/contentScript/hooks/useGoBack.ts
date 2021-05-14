import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';

export const useGoBack = (fallback?: () => unknown) => {
  const history = useHistory();

  return useCallback(() => {
    if (history.length < 2) {
      if (fallback) {
        fallback();

        return;
      }

      history.push('/');
    } else {
      history.goBack();
    }
  }, [history, fallback]);
};
