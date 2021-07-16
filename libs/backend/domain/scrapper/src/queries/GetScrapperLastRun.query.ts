import { Query } from 'functional-cqrs';

export interface GetScrapperLastRunPayload {
  scrapperId: string;
}

export const GetScrapperLastRun = 'GetScrapperLastRun' as const;

export class GetScrapperLastRunQuery implements Query {
  readonly name = GetScrapperLastRun;

  constructor(public readonly payload: GetScrapperLastRunPayload) {}
}
