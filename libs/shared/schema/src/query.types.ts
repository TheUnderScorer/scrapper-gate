import { Maybe, Order, Pagination } from './types';

export interface BaseQueryVariables {
  pagination?: Maybe<Pagination>;
  order?: Maybe<Order>;
}

export interface QueryVariablesWithUser extends BaseQueryVariables {
  userId: string;
}
