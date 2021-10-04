import { ScrapperModel } from '@scrapper-gate/backend/domain/scrapper';
import gql from 'graphql-tag';
import { BasicQueryTestCases } from '../../../../../tests/api/BasicQueryTestCases';
import { createScrapper } from '../../tests/createScrapper';
import { createUser } from '../../tests/createUser';
import '../../typings/global';

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
  let testCases: BasicQueryTestCases<ScrapperModel>;

  beforeEach(() => {
    testCases = new BasicQueryTestCases({
      query: getMyScrappers,
      queryDataKey: 'getMyScrappers',
      server: global.server,
      createEntity: createScrapper,
      createUser,
    });
  });

  it('should return all user scrappers', async () => {
    await testCases.returnAllForUserTest();
  });

  it('should handle pagination', async () => {
    await testCases.paginationTest();
  });

  it('should handle sorting', async () => {
    await testCases.sortingTest('createdAt');
  });
});
