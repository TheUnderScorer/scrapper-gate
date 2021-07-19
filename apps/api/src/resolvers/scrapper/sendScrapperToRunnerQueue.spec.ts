import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import {
  BrowserType,
  RunState,
  StartScrapperInput,
} from '@scrapper-gate/shared/schema';
import gql from 'graphql-tag';
import { createScrapper } from '../../tests/createScrapper';
import { createUser } from '../../tests/createUser';

const mutation = gql`
  mutation SendScrapperToRunnerQueue($input: StartScrapperInput!) {
    sendScrapperToRunnerQueue(input: $input) {
      id
      state
    }
  }
`;

describe('Send scrapper to runner queue', () => {
  it('should send scrapper to queue and mark it as pending', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    const response = await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<{ input: StartScrapperInput }>(mutation, {
        input: {
          browserType: BrowserType.Chrome,
          scrapperId: scrapper.id,
        },
      }),
    });

    const body = JSON.parse(response.body);

    expect(body.data.sendScrapperToRunnerQueue.state).toEqual(RunState.Pending);
  });
});
