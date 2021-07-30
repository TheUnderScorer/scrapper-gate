import { createMockUser } from '@scrapper-gate/shared/domain/user';
import { Scrapper, ScrapperType } from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import { v4 } from 'uuid';

export const createMockScrapper = (createdBy = createMockUser()): Scrapper => ({
  id: v4(),
  createdBy,
  name: faker.random.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
  steps: [],
  variables: [],
  type: ScrapperType.RealBrowser,
});
