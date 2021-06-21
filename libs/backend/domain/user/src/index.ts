import { CreateUser } from './commands/CreateUser.command';
import { createUserHandler } from './handlers/createUser.handler';

export * from './models/User.model';
export * from './repositories/User.repository';
export * from './user.entity';
export * from './handlers/createUser.handler';
export * from './commands/CreateUser.command';
export * from './events/UserCreated.event';

export const cqrs = {
  commandHandlers: {
    [CreateUser]: createUserHandler,
  },
};
