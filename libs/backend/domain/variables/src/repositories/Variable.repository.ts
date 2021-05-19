import { EntityRepository, Repository } from 'typeorm';
import { VariableModel } from '../models/Variable.model';

@EntityRepository(VariableModel)
export class VariableRepository extends Repository<VariableModel> {}
