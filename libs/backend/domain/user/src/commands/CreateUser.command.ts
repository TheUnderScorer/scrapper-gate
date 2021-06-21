import { Command } from 'functional-cqrs';
import { CreateUserInput } from '@scrapper-gate/shared/schema';

export interface CreateUserPayload {
  input: CreateUserInput;
}

export const CreateUser = 'CreateUser' as const;

export class CreateUserCommand implements Command {
  name = CreateUser;

  constructor(public readonly payload: CreateUserPayload) {}
}
