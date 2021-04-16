import { Handlers } from '@scrapper-gate/backend/cqrs';
import { createUserHandler } from '@scrapper-gate/backend/domain/user';
import { getScrappersByUserHandler } from '@scrapper-gate/backend/domain/scrapper';

export const handlers: Handlers = {
  commandHandlers: [createUserHandler],
  eventHandlers: [],
  queryHandlers: [getScrappersByUserHandler],
};
