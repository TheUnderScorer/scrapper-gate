import '../../typings/global';
import gql from 'graphql-tag';
import { createUser } from '../../tests/createUser';
import { createScrapper } from '../../tests/createScrapper';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import { apiRoutes } from '@scrapper-gate/shared/routing';

const getMyScrapper = gql`
  fragment CompleteUser on User {
    id
    email
    firstName
    lastName
    acceptTerms
    createdAt
    updatedAt
    deletedAt
  }

  query GetMyScrapper($id: ID!) {
    getMyScrapper(id: $id) {
      id
      createdAt
      createdBy {
        ...CompleteUser
      }
      deletedAt
      isRunning
      name
      state
      updatedAt
      steps {
        id
        createdAt
        createdBy {
          ...CompleteUser
        }
        deletedAt
        goBackSteps
        mouseButton
        navigateToUrl
        reloadDelay
        selectors {
          type
          value
        }
        typeDelay
        updatedAt
        url
        useUrlFromPreviousStep
      }
    }
  }
`;

describe('Get my scrapper', () => {
  it('should return user scrapper', async () => {
    const { tokens } = await createUser();
    const scrapper = await createScrapper(tokens.accessToken);

    const result = await global.server.inject({
      method: 'POST',
      payload: makeGraphqlRequest<{ id: string }>(getMyScrapper, {
        id: scrapper.id,
      }),
      headers: {
        authorization: `Bearer ${tokens.accessToken}`,
      },
      url: apiRoutes.graphql,
    });

    const body = JSON.parse(result.body);

    expect(body.data.getMyScrapper.id).toEqual(scrapper.id);
  });
});
