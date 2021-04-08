import { Handlers } from '@scrapper-gate/shared-backend/cqrs';
import { createUserHandler } from '@scrapper-gate/shared-backend/domain/user';

export const handlers: Handlers = {
  commandHandlers: [createUserHandler],
  eventHandlers: [],
  queryHandlers: [],
};
