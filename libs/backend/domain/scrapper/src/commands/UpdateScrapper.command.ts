import { Command } from 'functional-cqrs';
import { ScrapperInput } from '@scrapper-gate/shared/schema';

export interface UpdateScrapperPayload {
  input: ScrapperInput;
  userId: string;
}

export class UpdateScrapperCommand implements Command {
  constructor(public readonly payload: UpdateScrapperPayload) {}
}
