import '../fastify';
import { SecurityClient } from '@tshio/security-client';
import { FastifyInstance } from 'fastify';
import { HttpError, UnauthorizedError } from '@scrapper-gate/shared/errors';
import { StatusCodes } from 'http-status-codes';
import { UnpackPromise } from '@scrapper-gate/shared/common';

export interface ExtractTokenDependencies {
  securityClient: SecurityClient;
}

export const makeExtractToken = ({
  securityClient,
}: ExtractTokenDependencies) => async (fastify: FastifyInstance) => {
  fastify.decorateRequest('token', '');

  fastify.addHook('preHandler', async (req) => {
    const { authorization } = req.headers;

    if (authorization) {
      const [, token] = authorization.split(' ');

      if (!token) {
        throw new HttpError('Invalid token format.', StatusCodes.UNAUTHORIZED);
      }

      let isAuthorized: UnpackPromise<
        ReturnType<typeof securityClient.users.isAuthenticated>
      >;

      try {
        isAuthorized = await securityClient.users.isAuthenticated({
          accessToken: token,
        });
      } catch {
        throw new UnauthorizedError();
      }

      if (!isAuthorized.isAuthenticated) {
        throw new UnauthorizedError();
      }

      req.token = token;
    }
  });

  return fastify;
};

export type ExtractToken = ReturnType<typeof makeExtractToken>;
