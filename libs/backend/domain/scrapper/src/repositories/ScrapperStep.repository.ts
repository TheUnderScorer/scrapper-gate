import { EntityRepository, Repository } from 'typeorm';
import { ScrapperStepModel } from '../models/ScrapperStep.model';

@EntityRepository(ScrapperStepModel)
export class ScrapperStepRepository extends Repository<ScrapperStepModel> {}
