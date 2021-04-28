import { apiRoutes } from '@scrapper-gate/shared/routing';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import gql from 'graphql-tag';
import { ScrapperModel } from '@scrapper-gate/backend/domain/scrapper';

const createScrapperMutation = gql`
  mutation CreateScrapper($input: CreateScrapperInput) {
    createScrapper(input: $input) {
      id
    }
  }
`;

export const createScrapper = async (token: string) => {
  const response = await global.server.inject({
    method: 'POST',
    url: apiRoutes.graphql,
    payload: makeGraphqlRequest(createScrapperMutation),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { data } = JSON.parse(response.body);

  return global.connection
    .getRepository(ScrapperModel)
    .findOneOrFail(data.createScrapper.id, {
      relations: ['createdBy', 'steps'],
    });
};
