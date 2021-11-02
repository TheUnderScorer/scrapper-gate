import {
  ScrapperRunModel,
  ScrapperRunRepository,
} from '@scrapper-gate/backend/domain/scrapper';
import { RunState } from '@scrapper-gate/shared/schema';
import gql from 'graphql-tag';
import { BasicQueryTestCases } from '../../../../../tests/api/BasicQueryTestCases';
import { createScrapper } from '../../tests/createScrapper';
import { createUser } from '../../tests/createUser';
import '../../typings/global';

describe('Get my scrapper runs', () => {
  let testCases: BasicQueryTestCases<ScrapperRunModel>;

  beforeEach(() => {
    const scrapperRunRepository = global.connection.getCustomRepository(
      ScrapperRunRepository
    );

    testCases = new BasicQueryTestCases({
      server: global.server,
      query: gql`
        query GetMyScrapperRuns($pagination: Pagination, $order: Order) {
          getMyScrapperRuns(pagination: $pagination, order: $order) {
            total
            items {
              id
              createdBy {
                id
              }
              index
              state
              scrapper {
                id
              }
            }
          }
        }
      `,
      queryDataKey: 'getMyScrapperRuns',
      createUser,
      createEntity: async (token, user) => {
        const scrapper = await createScrapper(token);

        const run = ScrapperRunModel.create({
          key: 'test',
          index: 1,
          state: RunState.Pending,
          scrapper,
          steps: scrapper.steps ?? [],
          createdBy: user,
        });

        await scrapperRunRepository.save(run);

        return run;
      },
    });
  });

  it('should return user scrapper runs', async () => {
    await testCases.returnAllForUserTest();
  });

  it('should handle pagination', async () => {
    await testCases.paginationTest();
  });

  it('should handle sorting', async () => {
    await testCases.sortingTest('createdAt');
  });
});
