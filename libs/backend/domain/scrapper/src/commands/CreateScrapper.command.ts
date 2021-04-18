import { Command } from 'functional-cqrs';
import { CreateScrapperInput } from '@scrapper-gate/shared/schema';
import { UserModel } from '@scrapper-gate/backend/domain/user';

export interface CreateScrapperPayload {
  input?: CreateScrapperInput;
  user: UserModel;
}

export class CreateScrapperCommand implements Command {
  constructor(public readonly payload: CreateScrapperPayload) {}
}
