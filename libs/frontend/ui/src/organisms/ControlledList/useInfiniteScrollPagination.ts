import { Pagination } from '@scrapper-gate/shared/schema';
import { Dispatch, SetStateAction, useCallback } from 'react';

export interface UseInfiniteScrollPaginationParams {
  setPagination: Dispatch<SetStateAction<Pagination>>;
  take: number;
}

export const useInfiniteScrollPagination = ({
  setPagination,
  take,
}: UseInfiniteScrollPaginationParams) =>
  useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      take: prev.take + take,
    }));
  }, [setPagination, take]);
