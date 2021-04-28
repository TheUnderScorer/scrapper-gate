import { createUser } from '../../tests/createUser';
import { createScrapper } from '../../tests/createScrapper';
import gql from 'graphql-tag';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import {
  BaseQueryVariables,
  OrderDirection,
  Scrapper,
} from '@scrapper-gate/shared/schema';
import { getById, wait } from '@scrapper-gate/shared/common';

const getMyScrappers = gql`
  query GetMyScrappers($order: Order, $pagination: Pagination) {
    getMyScrappers(pagination: $pagination, order: $order) {
      total
      items {
        id
      }
    }
  }
`;

describe('Get my scrappers', () => {
  it('should return all user scrappers', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const {
      tokens: { accessToken: secondUserToken },
    } = await createUser();

    const createdScrappers = await Promise.all([
      createScrapper(accessToken),
      createScrapper(accessToken),
      createScrapper(accessToken),
      createScrapper(accessToken),
    ]);

    await createScrapper(secondUserToken);

    const response = await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<BaseQueryVariables>(getMyScrappers, {}),
    });

    const body = JSON.parse(response.body);

    expect(body.data.getMyScrappers.total).toEqual(4);

    const scrapperIds = (body.data.getMyScrappers.items as Scrapper[]).map(
      (scrapper) => scrapper.id
    );

    scrapperIds.forEach((id) => {
      const foundScrapper = getById(createdScrappers, id);

      expect(foundScrapper).toBeDefined();
    });
  });

  it('should handle pagination', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    await Promise.all([
      createScrapper(accessToken),
      createScrapper(accessToken),
      createScrapper(accessToken),
      createScrapper(accessToken),
    ]);

    const firstResponse = await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<BaseQueryVariables>(getMyScrappers, {
        pagination: {
          skip: 0,
          take: 3,
        },
      }),
    });

    const secondResponse = await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<BaseQueryVariables>(getMyScrappers, {
        pagination: {
          skip: 3,
          take: 3,
        },
      }),
    });

    const firstBody = JSON.parse(firstResponse.body);
    const secondBody = JSON.parse(secondResponse.body);

    expect(firstBody.data.getMyScrappers.items).toHaveLength(3);
    expect(secondBody.data.getMyScrappers.items).toHaveLength(1);
  });

  it('should handle sorting', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    await Promise.all([
      createScrapper(accessToken),
      createScrapper(accessToken),
      createScrapper(accessToken),
      createScrapper(accessToken),
    ]);

    await wait(250);

    const lastScrapper = await createScrapper(accessToken);

    const response = await global.server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<BaseQueryVariables>(getMyScrappers, {
        order: {
          direction: OrderDirection.Desc,
          column: 'createdAt',
        },
      }),
    });

    const body = JSON.parse(response.body);

    expect(body.data.getMyScrappers.items[0].id).toEqual(lastScrapper.id);
  });
});
