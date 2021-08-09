import { Pagination } from '@scrapper-gate/shared/schema';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

export interface UseNormalPaginationParams {
  total: number;
  pagination: Pagination;
  setPagination: Dispatch<SetStateAction<Pagination>>;
  setPage: Dispatch<SetStateAction<number>>;
}

export const useNormalPagination = ({
  total,
  pagination,
  setPagination,
  setPage,
}: UseNormalPaginationParams) => {
  const totalPages = useMemo(() => {
    if (!total) {
      return 0;
    }

    return Math.ceil(total / pagination.take);
  }, [total, pagination.take]);

  const handlePaginationChange = useCallback(
    (_: unknown, page: number) => {
      const newSkip = page > 1 ? Math.ceil(pagination.take * (page - 1)) : 0;

      setPagination((prev) => ({
        ...prev,
        skip: newSkip,
      }));

      setPage(page);
    },
    [pagination.take, setPage, setPagination]
  );

  return { totalPages, handlePaginationChange };
};
