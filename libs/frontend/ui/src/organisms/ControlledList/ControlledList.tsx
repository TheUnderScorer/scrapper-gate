import React, {
  ElementType,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DocumentNode, useQuery } from '@apollo/client';
import {
  Box,
  CircularProgress,
  List,
  Pagination as PaginationComponent,
  Typography,
} from '@material-ui/core';
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
import { Centered, Layout } from '@scrapper-gate/frontend/ui';

export interface RenderItemParams<
  Entity extends Pick<BaseEntity, 'id'> = BaseEntity
> {
  item: Entity;
  style: unknown;
}

const useStyles = makeStyles((theme) => ({
  list: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
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
  paginationType?: 'scroll' | 'pagination';
  component?: ElementType;
}

export const initialPagination: Pagination = {
  take: 10,
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
  component,
  paginationType = 'pagination',
}: ControlledListProps<Entity, QueryVars>) => {
  const [items, setItems] = useState<Entity[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const classes = useStyles();

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

  const totalPages = useMemo(() => {
    if (!result?.total) {
      return 0;
    }

    return Math.ceil(result.total / pagination.take);
  }, [result, pagination.take]);

  const handleNext = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      take: prev.take + take,
    }));
  }, [take]);

  const renderList = useCallback(() => {
    return (
      <List
        id={id}
        component={component}
        className={classNames(classes.list, className, 'controlled-list')}
      >
        {items.map((item) => renderItem({ item, style: {} }))}
      </List>
    );
  }, [className, classes.list, component, id, items, renderItem]);

  const handlePaginationChange = useCallback(
    (_: unknown, page: number) => {
      const newSkip = page > 1 ? Math.ceil(pagination.take * (page - 1)) : 0;

      setPagination((prev) => ({
        ...prev,
        skip: newSkip,
      }));

      setPage(page);
    },
    [pagination.take]
  );

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

  if (loading && (!didInitialFetch || paginationType === 'pagination')) {
    return (
      <Centered>
        <CircularProgress size={20} color="inherit" />
      </Centered>
    );
  }

  if (error) {
    return <Alert>{error.message}</Alert>;
  }

  if (paginationType === 'scroll') {
    return (
      <InfiniteScroll
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
        {renderList()}
      </InfiniteScroll>
    );
  }

  return (
    <Layout
      noGutters
      footer={
        total > pagination.take ? (
          <Centered>
            <PaginationComponent
              count={totalPages}
              page={page}
              onChange={handlePaginationChange}
            />
          </Centered>
        ) : undefined
      }
      footerHeight={50}
      body={renderList()}
    />
  );
};
