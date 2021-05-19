import { EntityRepository, Repository } from 'typeorm';
import { ScrapperRunStepResultModel } from '../models/ScrapperRunStepResult.model';

@EntityRepository(ScrapperRunStepResultModel)
export class ScrapperRunStepResultRepository extends Repository<ScrapperRunStepResultModel> {}
