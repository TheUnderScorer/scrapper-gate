import { UserRepository } from '@scrapper-gate/backend/domain/user';
import { FastifyInstance } from 'fastify';
import { HttpError } from '@scrapper-gate/shared/errors';
import { StatusCodes } from 'http-status-codes';
import { isTokenUserData, TokenDecoder } from '../types';

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

    req.user = await userRepository.findOne(decodedToken.userId);
  });
};

export type ExtractUser = ReturnType<typeof makeExtractUser>;
