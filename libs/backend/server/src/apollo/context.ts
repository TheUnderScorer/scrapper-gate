import { AwilixContainer } from 'awilix';
import { UnitOfWork } from '@scrapper-gate/backend/unit-of-work';
import { User } from '@scrapper-gate/shared/schema';

export interface BaseApolloContext {
  container: AwilixContainer;
  unitOfWork: UnitOfWork;
  user?: User;
}
