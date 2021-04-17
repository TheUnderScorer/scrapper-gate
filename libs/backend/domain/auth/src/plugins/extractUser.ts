import { UserRepository } from '@scrapper-gate/backend/domain/user';
import { FastifyInstance } from 'fastify';
import {
  isTokenUserData,
  TokenDecoder,
} from '@scrapper-gate/backend/domain/auth';
import { HttpError } from '@scrapper-gate/shared/errors';
import { StatusCodes } from 'http-status-codes';

export interface ExtractUserDependencies {
  userRepository: UserRepository;
  decodeToken: TokenDecoder;
}

export const makeExtractUser = ({
  userRepository,
  decodeToken,
}: ExtractUserDependencies) => async (fastify: FastifyInstance) => {
  fastify.decorateRequest('user', '');

  fastify.addHook('preHandler', async (req) => {
    if (!req.token) {
      return;
    }

    const decodedToken = decodeToken(req.token);

    if (!isTokenUserData(decodedToken)) {
      throw new HttpError('Invalid token.', StatusCodes.BAD_REQUEST);
    }

    req.user = await userRepository.findOneOrFail(decodedToken.userId);
  });
};

export type ExtractUser = ReturnType<typeof makeExtractUser>;
