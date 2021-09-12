import { Query } from 'functional-cqrs';

export interface GetMyScrapperRunPayload {
  id: string;
  userId: string;
}

export const GetMyScrapperRun = 'GetMyScrapperRun' as const;

export class GetMyScrapperRunQuery implements Query {
  readonly name = GetMyScrapperRun;

  constructor(public readonly payload: GetMyScrapperRunPayload) {}
}
