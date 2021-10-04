import { Pagination } from '@scrapper-gate/shared/schema';

export const initialPagination = Object.freeze<Pagination>({
  take: 10,
  skip: 0,
});
export const initialQueryVars: Record<string, unknown> = {};
