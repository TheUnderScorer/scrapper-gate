import { Query } from 'functional-cqrs';

export interface GetScrapperByUserPayload {
  userId: string;
  scrapperId: string;
}

export const GetScrapperByUser = 'GetScrapperByUser' as const;

export class GetScrapperByUserQuery implements Query {
  name = GetScrapperByUser;

  constructor(public readonly payload: GetScrapperByUserPayload) {}
}
