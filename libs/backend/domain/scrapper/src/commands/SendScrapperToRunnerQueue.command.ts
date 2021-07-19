import { StartScrapperInput } from '@scrapper-gate/shared/schema';
import { Command } from 'functional-cqrs';

export interface SendScrapperToRunnerQueuePayload {
  input: StartScrapperInput;
  userId: string;
}

export const SendScrapperToRunnerQueue = 'SendScrapperToRunnerQueue' as const;

export class SendScrapperToRunnerQueueCommand implements Command {
  name = SendScrapperToRunnerQueue;

  constructor(public readonly payload: SendScrapperToRunnerQueuePayload) {}
}
