import { QueryVariablesWithUser } from '@scrapper-gate/shared/schema';
import { Query } from 'functional-cqrs';

export const GetScrapperRunsByUser = 'GetScrapperRunsByUser' as const;

export class GetScrapperRunsByUserQuery implements Query {
  readonly name = GetScrapperRunsByUser;

  constructor(public readonly payload: QueryVariablesWithUser) {}
}
