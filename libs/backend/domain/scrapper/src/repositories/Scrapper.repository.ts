import { EntityRepository, Repository } from 'typeorm';
import { ScrapperModel } from '../models/Scrapper.model';

@EntityRepository(ScrapperModel)
export class ScrapperRepository extends Repository<ScrapperModel> {}
