import { User } from '@scrapper-gate/shared/schema';
import * as faker from 'faker';

export const createMockUser = (): User => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  createdAt: new Date(),
  updatedAt: new Date(),
  acceptTerms: true,
});
