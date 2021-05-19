import { EntityRepository, Repository } from 'typeorm';
import { ScrapperRunModel } from '../models/ScrapperRun.model';

@EntityRepository(ScrapperRunModel)
export class ScrapperRunRepository extends Repository<ScrapperRunModel> {}
