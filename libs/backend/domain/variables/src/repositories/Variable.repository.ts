import { VariableScope } from '@scrapper-gate/shared/schema';
import { EntityRepository, Repository } from 'typeorm';
import { VariableModel } from '../models/Variable.model';

@EntityRepository(VariableModel)
export class VariableRepository extends Repository<VariableModel> {
  async findAllGlobalForUser(userId: string) {
    return this.find({
      where: {
        createdBy: {
          id: userId,
        },
        scope: VariableScope.Global,
      },
      relations: ['createdBy'],
    });
  }
}
