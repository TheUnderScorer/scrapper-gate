import { Order, Pagination } from './types';

export interface BaseQueryVariables {
  pagination?: Pagination;
  order?: Order;
}
