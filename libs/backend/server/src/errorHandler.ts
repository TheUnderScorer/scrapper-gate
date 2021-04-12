import { FastifyInstance } from 'fastify';
import { HttpError } from '@scrapper-gate/shared/errors';
import { ValidationError } from '@scrapper-gate/shared/validation';

export const errorHandler: FastifyInstance['errorHandler'] = async (
  error,
  request,
  reply
) => {
  if (error instanceof HttpError) {
    reply.statusCode = error.statusCode;
  }

  return {
    message: error.message,
    name: error.name,
    details: error instanceof ValidationError ? error.details : undefined,
  };
};
