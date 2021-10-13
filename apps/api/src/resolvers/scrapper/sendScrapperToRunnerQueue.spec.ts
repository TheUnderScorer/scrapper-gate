import { ScrapperRunRepository } from '@scrapper-gate/backend/domain/scrapper';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import {
  BrowserType,
  RunState,
  ScrapperDialogBehaviour,
  StartScrapperInput,
} from '@scrapper-gate/shared/schema';
import faker from 'faker';
import gql from 'graphql-tag';
import { createScrapper } from '../../tests/createScrapper';
import { createUser } from '../../tests/createUser';

const mutation = gql`
  mutation SendScrapperToRunnerQueue($input: StartScrapperInput!) {
    sendScrapperToRunnerQueue(input: $input) {
      scrapper {
        id
        lastRun {
          id
          state
        }
      }
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

    expect(body.data.sendScrapperToRunnerQueue?.scrapper.lastRun.state).toEqual(
      RunState.Pending
    );
  });

  it('should send scrapper to queue with custom run settings', async () => {
    const runRepository = global.connection.getCustomRepository(
      ScrapperRunRepository
    );

    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    const runSettings = {
      dialogBehaviour: ScrapperDialogBehaviour.AlwaysReject,
      initialUrl: faker.internet.url(),
    };

    await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<{ input: StartScrapperInput }>(mutation, {
        input: {
          browserType: BrowserType.Chrome,
          scrapperId: scrapper.id,
          runSettings: runSettings,
        },
      }),
    });

    const run = await runRepository.findLastForScrapper(scrapper.id);

    expect(run?.runSettings).toEqual(runSettings);
  });
});
