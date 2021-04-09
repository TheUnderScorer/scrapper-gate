import { EntityRepository, Repository } from 'typeorm';
import { UserModel } from '@scrapper-gate/shared-backend/domain/user';

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {
  async findByEmail(email: string) {
    return this.findOne({
      email,
    });
  }
}
