import { AwilixContainer } from 'awilix';
import { UnitOfWork } from '@scrapper-gate/shared-backend/unit-of-work';

export interface BaseApolloContent {
  container: AwilixContainer;
  unitOfWork: UnitOfWork;
}
