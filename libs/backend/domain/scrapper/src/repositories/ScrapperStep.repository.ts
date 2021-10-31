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

  async detachAll(steps: ScrapperStepModel[]) {
    const detachedSteps = steps.map((step) =>
      step.fill({
        nextStep: null,
        stepOnTrue: null,
        stepOnFalse: null,
      })
    );

    await this.save(detachedSteps);

    return detachedSteps;
  }
}
