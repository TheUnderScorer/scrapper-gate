import { Query } from 'functional-cqrs';

export interface GetScrapperByUserPayload {
  userId: string;
  scrapperId: string;
}

export class GetScrapperByUserQuery implements Query {
  constructor(public readonly payload: GetScrapperByUserPayload) {}
}
