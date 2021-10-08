/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Alert,
  CircularProgress,
  List,
  Pagination as PaginationComponent,
  Typography,
} from '@mui/material';
import { BaseEntity } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { ReactElement, ReactNode, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Centered } from '../../../atoms/Centered/Centered';
import { Layout } from '../../../molecules/Layout/Layout';
import { ControlledBaseProps } from '../Controlled.types';
import { initialPagination, initialQueryVars } from '../initial';
import { useControlled } from '../useControlled';

export interface RenderItemParams<
  Entity extends Pick<BaseEntity, 'id'> = BaseEntity
> {
  item: Entity;
  style: unknown;
}

export interface ControlledListProps<
  Entity extends Pick<BaseEntity, 'id'> = BaseEntity,
  QueryVars = unknown
> extends ControlledBaseProps<Entity, QueryVars> {
  renderItem: (params: RenderItemParams<Entity>) => ReactNode;
}

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
  const {
    items,
    total,
    page,
    didInitialFetch,
    error,
    loading,
    handleNext,
    totalPages,
    handlePaginationChange,
    showEmptyContent,
    showPagination,
  } = useControlled({
    defaultPagination,
    defaultOrder,
    query,
    fetchPolicy,
    queryVars,
    onLoadingChange,
    onDataChange,
  });

  const renderList = useCallback(() => {
    return (
      <List
        id={id}
        component={component!}
        className={classNames(className, 'controlled-list')}
        sx={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {items.map((item) => renderItem({ item, style: {} }))}
      </List>
    );
  }, [className, component, id, items, renderItem]);

  if (showEmptyContent) {
    return (
      (emptyContent as ReactElement) ?? (
        <Centered
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            overflowY: 'auto !important' as 'auto',
            overflowX: 'hidden !important' as 'hidden',
          }}
        >
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
        showPagination ? (
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
