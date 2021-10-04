import { QueryResult } from '@scrapper-gate/shared/common';
import { EntitiesWithTotal } from '../types';

export class QueryResultModel<T> implements QueryResult<T> {
  constructor(public items: T[], public total: number) {}

  static fromEntitiesWithTotal<T>([
    items,
    total,
  ]: EntitiesWithTotal<T>): QueryResultModel<T> {
    return new QueryResultModel<T>(items, total);
  }
}
