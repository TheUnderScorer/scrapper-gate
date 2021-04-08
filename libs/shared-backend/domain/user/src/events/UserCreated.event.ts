import { UserModel } from '@scrapper-gate/shared-backend/domain/user';
import { Event } from 'functional-cqrs';

export interface UserCreatedEventPayload {
  user: UserModel;
}

export class UserCreatedEvent implements Event {
  constructor(readonly payload: UserCreatedEventPayload) {}
}
