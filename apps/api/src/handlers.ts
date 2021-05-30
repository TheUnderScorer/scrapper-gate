import { Handlers } from '@scrapper-gate/backend/cqrs';
import {
  createScrapperHandler,
  getScrapperByUserHandler,
  getScrappersByUserHandler,
  updateScrapperHandler,
} from '@scrapper-gate/backend/domain/scrapper';
import { createUserHandler } from '@scrapper-gate/backend/domain/user';

export const handlers: Handlers = {
  commandHandlers: [
    createUserHandler,
    createScrapperHandler,
    updateScrapperHandler,
  ],
  eventHandlers: [],
  queryHandlers: [getScrappersByUserHandler, getScrapperByUserHandler],
};
