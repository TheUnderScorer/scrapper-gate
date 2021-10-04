import { DocumentNode } from '@apollo/client';
import { FetchPolicyProps } from '@scrapper-gate/frontend/common';
import { QueryResult } from '@scrapper-gate/shared/common';
import { BaseEntity, Order, Pagination } from '@scrapper-gate/shared/schema';
import { ElementType, ReactNode } from 'react';

export interface ControlledBaseProps<
  Entity extends Pick<BaseEntity, 'id'> = BaseEntity,
  QueryVars = unknown
> extends FetchPolicyProps {
  id: string;
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
