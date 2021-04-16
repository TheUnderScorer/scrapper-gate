import { Query } from 'functional-cqrs';
import { GetScrappersByUserParams } from '../repositories/Scrapper.repository';

export class GetScrappersByUserQuery implements Query {
  constructor(public readonly payload: GetScrappersByUserParams) {}
}
