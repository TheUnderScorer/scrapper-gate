import { EntityRepository, Repository } from 'typeorm';
import { ScrapperStepModel } from '../models/ScrapperStep.model';

@EntityRepository(ScrapperStepModel)
export class ScrapperStepRepository extends Repository<ScrapperStepModel> {
  async removeAllForScrapper(scrapperId: string) {
    const builder = this.createQueryBuilder('steps');

    return builder
      .leftJoinAndSelect('scrapper.steps.id', 'scrapper')
      .where('scrapper.id = :scrapperId', { scrapperId })
      .delete();
  }
}
