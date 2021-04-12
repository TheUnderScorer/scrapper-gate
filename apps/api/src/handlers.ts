import { Handlers } from '@scrapper-gate/backend/cqrs';
import { createUserHandler } from '@scrapper-gate/backend/domain/user';

export const handlers: Handlers = {
  commandHandlers: [createUserHandler],
  eventHandlers: [],
  queryHandlers: [],
};
