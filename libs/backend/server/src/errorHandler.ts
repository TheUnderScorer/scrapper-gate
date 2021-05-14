import { FastifyInstance } from 'fastify';
import { HttpError } from '@scrapper-gate/shared/errors';
import { ValidationError } from '@scrapper-gate/shared/validation';
import { Logger } from '@scrapper-gate/shared/logger';

export interface ErrorHandlerDependencies {
  logger: Logger;
}

export const errorHandler = ({
  logger,
}: ErrorHandlerDependencies): FastifyInstance['errorHandler'] => async (
  error,
  request,
  reply
) => {
  logger.error(`API error:`, error.message);

  if (error instanceof HttpError) {
    reply.statusCode = error.statusCode;
  }

  return {
    message: error.message,
    name: error.name,
    details: error instanceof ValidationError ? error.details : undefined,
  };
};

export type ErrorHandler = ReturnType<typeof errorHandler>;
