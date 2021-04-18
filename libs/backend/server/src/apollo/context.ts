import { AwilixContainer } from 'awilix';
import { UnitOfWork } from '@scrapper-gate/backend/unit-of-work';
import { User } from '@scrapper-gate/shared/schema';

export interface BaseApolloContext<TUser extends User = User> {
  container: AwilixContainer;
  unitOfWork: UnitOfWork;
  user?: TUser;
}
