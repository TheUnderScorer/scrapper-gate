import { createMockUser } from '@scrapper-gate/shared/domain/user/mocks';
import { Scrapper, ScrapperType } from '@scrapper-gate/shared/schema';
import faker from 'faker';
import { v4 } from 'uuid';
import { createMockScrapperRun } from './mockScrapperRun';

export const createMockScrapper = (createdBy = createMockUser()): Scrapper => ({
  id: v4(),
  createdBy,
  name: faker.random.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
  steps: [],
  variables: [],
  type: ScrapperType.RealBrowser,
  isRunning: false,
  lastRun: createMockScrapperRun([], createdBy),
});
