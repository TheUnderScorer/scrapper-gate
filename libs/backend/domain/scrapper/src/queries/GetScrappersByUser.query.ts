import { QueryVariablesWithUser } from '@scrapper-gate/shared/schema';
import { Query } from 'functional-cqrs';

export const GetScrappersByUser = 'GetScrappersByUser' as const;

export class GetScrappersByUserQuery implements Query {
  name = GetScrappersByUser;

  constructor(public readonly payload: QueryVariablesWithUser) {}
}
