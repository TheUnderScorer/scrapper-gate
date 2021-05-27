import { createMockUser } from '@scrapper-gate/shared/domain/user';
import { Scrapper } from '@scrapper-gate/shared/schema';
import * as faker from 'faker';

export const createMockScrapper = (createdBy = createMockUser()): Scrapper => ({
  id: faker.datatype.uuid(),
  createdBy,
  name: faker.random.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
  steps: [],
  variables: [],
});
