import { useQuery } from '@apollo/client';
import { QueryResult } from '@scrapper-gate/shared/common';
import {
  BaseEntity,
  BaseQueryVariables,
  Order,
  Pagination,
} from '@scrapper-gate/shared/schema';
import { useEffect, useMemo, useState } from 'react';
import { ControlledBaseProps } from './Controlled.types';
import { initialPagination } from './initial';
import { useInfiniteScrollPagination } from './useInfiniteScrollPagination';
import { useNormalPagination } from './useNormalPagination';

export function useControlled<
  Entity extends Pick<BaseEntity, 'id'>,
  QueryVars
>({
  query,
  queryVars,
  defaultOrder,
  onLoadingChange,
  onDataChange,
  defaultPagination = initialPagination,
  fetchPolicy,
}: Omit<
  ControlledBaseProps<Entity, QueryVars>,
  'id' | 'className' | 'emptyContent' | 'component'
>) {
  const [items, setItems] = useState<Entity[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [didInitialFetch, setDidInitialFetch] = useState(false);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [order] = useState<Order | undefined>(defaultOrder);

  const { take } = pagination;

  const { data, error, loading } = useQuery<
    QueryResult<Entity>,
    BaseQueryVariables & Record<string, unknown>
  >(query, {
    fetchPolicy,
    variables: {
      pagination,
      order,
      ...queryVars,
    },
  });

  const result: QueryResult<Entity> | null = useMemo(
    () => (data ? Object.values(data)[0] : null),
    [data]
  );

  const handleNext = useInfiniteScrollPagination({
    setPagination,
    take,
  });

  const { totalPages, handlePaginationChange } = useNormalPagination({
    total,
    pagination,
    setPagination,
    setPage,
  });

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  }, [loading, onLoadingChange]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(result);
    }
  }, [result, onDataChange]);

  useEffect(() => {
    if (result?.items) {
      setItems(result.items);
    }

    if (result?.total) {
      setTotal(result.total);
    }
  }, [result]);

  useEffect(() => {
    if (result?.items.length && !didInitialFetch) {
      setDidInitialFetch(true);
    }
  }, [didInitialFetch, result]);

  return {
    items,
    total,
    page,
    didInitialFetch,
    pagination,
    error,
    loading,
    result,
    handleNext,
    totalPages,
    handlePaginationChange,
    showEmptyContent: !loading && !result?.total,
    showPagination: total > pagination.take,
  };
}
