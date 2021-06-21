import { Command } from 'functional-cqrs';
import { ScrapperInput } from '@scrapper-gate/shared/schema';

export interface UpdateScrapperPayload {
  input: ScrapperInput;
  userId: string;
}

export const UpdateScrapper = 'UpdateScrapper' as const;

export class UpdateScrapperCommand implements Command {
  name = UpdateScrapper;

  constructor(public readonly payload: UpdateScrapperPayload) {}
}
