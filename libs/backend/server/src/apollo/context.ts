import { AwilixContainer } from 'awilix';
import { UnitOfWork } from '@scrapper-gate/backend/unit-of-work';
import { User } from '@scrapper-gate/shared/schema';
import { CqrsResult } from 'functional-cqrs';

export interface BaseApolloContext<
  TUser extends User = User,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Cqrs extends CqrsResult<any, any> = CqrsResult<any, any>
> {
  container: AwilixContainer;
  unitOfWork: UnitOfWork<Cqrs>;
  user?: TUser;
}
