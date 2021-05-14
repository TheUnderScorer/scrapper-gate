import { EntityDefinition } from '@scrapper-gate/backend/database';
import { UserModel } from './models/User.model';
import { Entities } from '@scrapper-gate/shared/common';
import { UserRepository } from './repositories/User.repository';

export const userEntity: EntityDefinition<UserModel> = {
  model: UserModel,
  entity: Entities.User,
  repository: UserRepository,
  repositoryKey: 'userRepository',
};
