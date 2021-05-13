import { Event } from 'functional-cqrs';
import { UserModel } from '../models/User.model';

export interface UserCreatedEventPayload {
  user: UserModel;
}

export class UserCreatedEvent implements Event {
  constructor(readonly payload: UserCreatedEventPayload) {}
}
