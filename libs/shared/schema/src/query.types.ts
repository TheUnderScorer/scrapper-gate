import { Order, Pagination } from '@scrapper-gate/shared/schema';

export interface BaseQueryVariables {
  pagination?: Pagination;
  order?: Order;
}
