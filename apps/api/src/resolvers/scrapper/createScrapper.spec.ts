import { createUser } from '../../tests/createUser';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import gql from 'graphql-tag';

const createScrapper = gql`
  mutation CreateScrapper($input: CreateScrapperInput) {
    createScrapper(input: $input) {
      id
    }
  }
`;

describe('Create scrapper', () => {
  it('should create scrapper', async () => {
    const { tokens } = await createUser();

    const response = await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      payload: makeGraphqlRequest(createScrapper),
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const { data } = JSON.parse(response.body);

    expect(data.createScrapper.id).toBeDefined();
  });
});
