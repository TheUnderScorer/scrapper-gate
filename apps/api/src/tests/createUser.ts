import faker from 'faker';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import {
  AuthTokens,
  MutationCreateUserArgs,
} from '@scrapper-gate/shared/schema';
import { UserRepository } from '@scrapper-gate/backend/domain/user';
import gql from 'graphql-tag';

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

  const user = await global.container
    .resolve<UserRepository>('userRepository')
    .findOne(result.data.createUser.user.id);

  return {
    tokens: result.data.createUser.tokens as Required<AuthTokens>,
    user,
  };
};
