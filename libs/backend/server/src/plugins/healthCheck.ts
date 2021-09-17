import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

export const healthCheck = (instance: FastifyInstance, route = '/health') => {
  instance.get(route, async (request, reply) => {
    reply.status(StatusCodes.OK);

    return {
      alive: true,
    };
  });
};
