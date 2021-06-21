import { Command } from 'functional-cqrs';
import { CreateScrapperInput } from '@scrapper-gate/shared/schema';
import { UserModel } from '@scrapper-gate/backend/domain/user';

export interface CreateScrapperPayload {
  input?: CreateScrapperInput;
  user: UserModel;
}

export const CreateScrapper = 'CreateScrapper' as const;

export class CreateScrapperCommand implements Command {
  name = CreateScrapper;

  constructor(public readonly payload: CreateScrapperPayload) {}
}
