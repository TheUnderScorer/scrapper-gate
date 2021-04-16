import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactElement,
} from 'react';
import { DocumentNode, useQuery } from '@apollo/client';
import { CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Alert } from '@material-ui/lab';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  BaseEntity,
  BaseQueryVariables,
  Order,
  Pagination,
} from '@scrapper-gate/shared/schema';
import { FetchPolicyProps } from '@scrapper-gate/frontend/common';
import { QueryResult } from '@scrapper-gate/shared/common';
import { Centered } from '@scrapper-gate/frontend/ui';

export interface RenderItemParams<
  Entity extends Pick<BaseEntity, 'id'> = BaseEntity
> {
  item: Entity;
  style: unknown;
}

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    overflow: 'auto',
    padding: 0,
    margin: 0,
  },
  scroll: {
    overflowY: 'auto !important' as 'auto',
    overflowX: 'hidden !important' as 'hidden',
  },
}));

export interface ControlledListProps<
  Entity extends Pick<BaseEntity, 'id'> = BaseEntity,
  QueryVars = unknown
> extends FetchPolicyProps {
  id: string;
  renderItem: (params: RenderItemParams<Entity>) => ReactNode;
  query: DocumentNode;
  queryVars?: QueryVars;
  defaultPagination?: Pagination;
  defaultOrder?: Order;
  emptyContent?: ReactNode;
  onLoadingChange?: (loading: boolean) => unknown;
  className?: string;
  onDataChange?: (data: QueryResult<Entity> | null) => unknown;
  paginationType?: 'scroll';
}

export const initialPagination: Pagination = {
  take: 9,
  skip: 0,
};

const initialQueryVars: Record<string, unknown> = {};

export const ControlledList = <
  Entity extends Pick<BaseEntity, 'id'> = BaseEntity,
  QueryVars extends Record<string, unknown> = Record<string, unknown>
>({
  query,
  queryVars = initialQueryVars as QueryVars,
  renderItem,
  defaultPagination = initialPagination,
  defaultOrder,
  onLoadingChange,
  emptyContent,
  className,
  fetchPolicy,
  onDataChange,
  id,
}: ControlledListProps<Entity, QueryVars>) => {
  const [items, setItems] = useState<Entity[]>([]);
  const [total, setTotal] = useState(0);
  const containerRef = useRef<HTMLDivElement>();

  const classes = useStyles();

  const [didInitialFetch, setDidInitialFetch] = useState(false);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [order] = useState<Order | undefined>(defaultOrder);

  const take = useMemo(() => pagination.take, [pagination.take]);

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

  const handleNext = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      take: prev.take + take,
    }));
  }, [take]);

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

  if (!loading && !result?.total) {
    return (
      (emptyContent as ReactElement) ?? (
        <Centered>
          <Typography>No results found.</Typography>
        </Centered>
      )
    );
  }

  if (loading && !didInitialFetch) {
    return (
      <Centered>
        <CircularProgress size={20} color="inherit" />
      </Centered>
    );
  }

  if (error) {
    return <Alert>{error.message}</Alert>;
  }

  return (
    <div
      id={id}
      ref={containerRef as MutableRefObject<HTMLDivElement>}
      className={classNames(classes.container, className, 'controlled-list')}
    >
      <InfiniteScroll
        className={classes.scroll}
        scrollableTarget={id}
        loader={
          <Centered>
            <CircularProgress size={20} />
          </Centered>
        }
        dataLength={items.length}
        hasMore={total > items.length}
        next={handleNext}
      >
        {items.map((item) => renderItem({ item, style: {} }))}
      </InfiniteScroll>
    </div>
  );
};
