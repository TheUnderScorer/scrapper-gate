import { applyQueryVariables } from '@scrapper-gate/backend/db-utils';
import { ScrapperNotFoundError } from '@scrapper-gate/shared/errors';
import { completedRunStates } from '@scrapper-gate/shared/run-states';
import { BaseQueryVariables, RunState } from '@scrapper-gate/shared/schema';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { ScrapperModel } from '../models/Scrapper.model';

export interface GetScrappersByUserParams extends BaseQueryVariables {
  userId: string;
}

@EntityRepository(ScrapperModel)
export class ScrapperRepository extends Repository<ScrapperModel> {
  async getByUser({ userId, ...rest }: GetScrappersByUserParams) {
    const queryBuilder = this.createQueryBuilder('scrapper');

    applyQueryVariables({
      queryBuilder,
      alias: 'scrapper',
      ...rest,
    });

    return queryBuilder
      .leftJoin('scrapper.createdBy', 'createdBy')
      .where('createdBy.id = :userId', { userId })
      .getManyAndCount();
  }

  async getOneForRun(scrapperId: string) {
    const queryBuilder = this.createQueryBuilder('scrapper');

    return queryBuilder
      .leftJoinAndSelect('scrapper.createdBy', 'createdBy')
      .leftJoinAndSelect('scrapper.steps', 'steps')
      .leftJoinAndSelect('steps.nextStep', 'nextStep')
      .leftJoinAndSelect('steps.stepOnTrue', 'stepOnTrue')
      .leftJoinAndSelect('steps.stepOnFalse', 'stepOnFalse')
      .where('scrapper.id = :scrapperId', { scrapperId })
      .andWhere(
        new Brackets((clause) =>
          clause
            .where('scrapper.state IS NULL')
            .orWhere('scrapper.state IN (:...states)', {
              states: [...completedRunStates, RunState.Pending],
            })
        )
      )
      .getOneOrFail();
  }

  async findOneAggregateForUser(scrapperId: string, userId: string) {
    return this.findOne({
      where: {
        id: scrapperId,
        createdBy: {
          id: userId,
        },
      },
      relations: [
        'createdBy',
        'steps',
        'variables',
        'steps.nextStep',
        'steps.stepOnTrue',
        'steps.stepOnFalse',
        'steps.previousSteps',
      ],
    });
  }

  async getOneAggregateByUser(scrapperId: string, userId: string) {
    const scrapper = await this.findOneAggregateForUser(scrapperId, userId);

    if (!scrapper) {
      throw new ScrapperNotFoundError();
    }

    return scrapper;
  }
}
