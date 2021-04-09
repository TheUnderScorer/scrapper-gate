import '../fastify';
import { SecurityClient } from '@tshio/security-client';
import { FastifyInstance } from 'fastify';
import { HttpError } from '@scrapper-gate/shared/errors';
import { StatusCodes } from 'http-status-codes';

export interface ExtractTokenDependencies {
  securityClient: SecurityClient;
}

export const makeExtractToken = ({
  securityClient,
}: ExtractTokenDependencies) => async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', async (req) => {
    const { authorization } = req.headers;

    if (authorization) {
      const [, token] = authorization.split(' ');

      if (!token) {
        throw new HttpError('Invalid token format.', StatusCodes.UNAUTHORIZED);
      }

      const isAuthorized = await securityClient.users.isAuthenticated({
        accessToken: token,
      });

      if (!isAuthorized) {
        throw new HttpError(
          'User is not authorized.',
          StatusCodes.UNAUTHORIZED
        );
      }

      req.token = token;
    }
  });

  return fastify;
};

export type ExtractToken = ReturnType<typeof makeExtractToken>;
