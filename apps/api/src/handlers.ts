import { Handlers } from '@scrapper-gate/backend/cqrs';
import { createUserHandler } from '@scrapper-gate/backend/domain/user';
import {
  createScrapperHandler,
  getScrapperByUserHandler,
  getScrappersByUserHandler,
  updateScrapperHandler,
} from '@scrapper-gate/backend/domain/scrapper';
import { VariablesSubscriber } from '@scrapper-gate/backend/domain/variables';

export const handlers: Handlers = {
  commandHandlers: [
    createUserHandler,
    createScrapperHandler,
    updateScrapperHandler,
  ],
  eventHandlers: [VariablesSubscriber],
  queryHandlers: [getScrappersByUserHandler, getScrapperByUserHandler],
};
