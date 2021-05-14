import { BooleanParam, useQueryParam } from 'use-query-params';

export const useIsUsingElementPicker = () => {
  return useQueryParam('isUsingElementPicker', BooleanParam);
};
