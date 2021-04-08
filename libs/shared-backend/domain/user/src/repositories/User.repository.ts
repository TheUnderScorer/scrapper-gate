import { EntityRepository, Repository } from 'typeorm';
import { UserModel } from '@scrapper-gate/shared-backend/domain/user';

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {}
