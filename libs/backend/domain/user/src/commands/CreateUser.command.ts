import { Command } from 'functional-cqrs';
import { CreateUserInput } from '@scrapper-gate/shared/schema';

export interface CreateUserPayload {
  input: CreateUserInput;
}

export class CreateUserCommand implements Command {
  constructor(public readonly payload: CreateUserPayload) {}
}
