import { EntityRepository, Repository } from 'typeorm';
import { ScrapperRunStepValueModel } from '../models/ScrapperRunStepValue.model';

@EntityRepository(ScrapperRunStepValueModel)
export class ScrapperRunStepValueRepository extends Repository<ScrapperRunStepValueModel> {}
