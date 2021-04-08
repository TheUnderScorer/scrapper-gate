import gql from 'graphql-tag';
import '../typings/global';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { MutationCreateUserArgs } from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import { makeGraphqlRequest } from '@scrapper-gate/shared-backend/server';
import { UserRepository } from '@scrapper-gate/shared-backend/domain/user';
import { EmailAlreadyTakenError } from '@scrapper-gate/shared/errors';

const createUser = gql`
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

describe('Create user', () => {
  it('should create new user', async () => {
    const email = faker.internet.email();

    const response = await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      payload: makeGraphqlRequest<MutationCreateUserArgs>(createUser, {
        input: {
          email,
          password: 'passw0rd',
        },
      }),
    });

    const result = JSON.parse(response.body);

    expect(result.data.createUser.user.id).toBeDefined();

    const user = await global.container
      .resolve<UserRepository>('userRepository')
      .findOne(result.data.createUser.user.id);

    expect(user.email).toEqual(email);
  });

  it('should throw if e-mail is already taken', async () => {
    const email = faker.internet.email();

    await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      payload: makeGraphqlRequest<MutationCreateUserArgs>(createUser, {
        input: {
          email,
          password: 'passw0rd',
        },
      }),
    });

    const response = await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      payload: makeGraphqlRequest<MutationCreateUserArgs>(createUser, {
        input: {
          email,
          password: 'passw0rd',
        },
      }),
    });

    const result = JSON.parse(response.body);

    expect(result.errors[0].name).toEqual(EmailAlreadyTakenError.name);
  });
});
