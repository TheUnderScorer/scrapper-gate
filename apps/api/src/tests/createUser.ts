import { UserRepository } from '@scrapper-gate/backend/domain/user';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import { ExistsInObject } from '@scrapper-gate/shared/common';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import {
  AuthTokens,
  MutationCreateUserArgs,
} from '@scrapper-gate/shared/schema';
import faker from 'faker';
import gql from 'graphql-tag';
import '../../../../typings/global';

const createUserMutation = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        email
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

export const createUser = async () => {
  const email = faker.internet.email();

  const response = await global.server.inject({
    method: 'POST',
    url: apiRoutes.graphql,
    payload: makeGraphqlRequest<MutationCreateUserArgs>(createUserMutation, {
      input: {
        email,
        password: 'passw0rd',
        acceptTerms: true,
      },
    }),
  });

  const result = JSON.parse(response.body);

  if (!result.data) {
    console.error(result);

    throw new Error('Failed to create user');
  }

  const user = await global.container
    .resolve<UserRepository>('userRepository')
    .findOneOrFail(result.data.createUser.user.id);

  return {
    tokens: result.data.createUser.tokens as ExistsInObject<AuthTokens>,
    user,
  };
};
