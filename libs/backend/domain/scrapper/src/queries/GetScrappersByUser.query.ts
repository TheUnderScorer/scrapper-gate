import { Query } from 'functional-cqrs';
import { GetScrappersByUserParams } from '../repositories/Scrapper.repository';

export const GetScrappersByUser = 'GetScrappersByUser' as const;

export class GetScrappersByUserQuery implements Query {
  name = GetScrappersByUser;

  constructor(public readonly payload: GetScrappersByUserParams) {}
}
