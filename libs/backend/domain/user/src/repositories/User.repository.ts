import { EntityRepository, Repository } from 'typeorm';
import { UserModel } from '../models/User.model';

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {
  async findByEmail(email: string) {
    return this.findOne({
      email,
    });
  }
}
