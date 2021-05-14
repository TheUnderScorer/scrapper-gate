import { Handlers } from '@scrapper-gate/backend/cqrs';
import { createUserHandler } from '@scrapper-gate/backend/domain/user';
import {
  createScrapperHandler,
  getScrapperByUserHandler,
  getScrappersByUserHandler,
  updateScrapperHandler,
} from '@scrapper-gate/backend/domain/scrapper';

export const handlers: Handlers = {
  commandHandlers: [
    createUserHandler,
    createScrapperHandler,
    updateScrapperHandler,
  ],
  eventHandlers: [],
  queryHandlers: [getScrappersByUserHandler, getScrapperByUserHandler],
};
