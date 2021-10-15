import { Command } from 'functional-cqrs';

export interface HandleFailedScrapperRunStartPayload {
  runId: string;
}

export const HandleFailedScrapperRunStart =
  'HandleFailedScrapperRunStart' as const;

export class HandleFailedScrapperRunStartCommand implements Command {
  name = HandleFailedScrapperRunStart;

  constructor(public readonly payload: HandleFailedScrapperRunStartPayload) {}
}
