import { SelectQueryBuilder } from 'typeorm';
import {
  Order,
  OrderDirection,
  Pagination,
} from '@scrapper-gate/shared/schema';

export const applyPagination = (
  queryBuilder: SelectQueryBuilder<unknown>,
  pagination: Pagination
) => {
  queryBuilder.take(pagination.take).skip(pagination.skip);

  return queryBuilder;
};

interface ApplyOrderParams {
  queryBuilder: SelectQueryBuilder<unknown>;
  order: Order;
  alias: string;
}

interface ApplyQueryVariablesParams extends Partial<ApplyOrderParams> {
  pagination?: Pagination;
  queryBuilder: SelectQueryBuilder<unknown>;
}

export const applyOrder = ({
  queryBuilder,
  order,
  alias,
}: ApplyOrderParams) => {
  queryBuilder.orderBy(
    `${alias}.${order.column.toString()}`,
    order.direction === OrderDirection.Asc ? 'ASC' : 'DESC'
  );

  return queryBuilder;
};

export const applyQueryVariables = ({
  queryBuilder,
  order,
  alias,
  pagination,
}: ApplyQueryVariablesParams) => {
  if (pagination) {
    applyPagination(queryBuilder, pagination);
  }

  if (order && alias) {
    applyOrder({
      queryBuilder,
      order,
      alias,
    });
  }

  return queryBuilder;
};
