import { applyQueryVariables } from '@scrapper-gate/backend/db-utils';
import { ScrapperNotFoundError } from '@scrapper-gate/shared/errors';
import { completedRunStates } from '@scrapper-gate/shared/run-states';
import { BaseQueryVariables } from '@scrapper-gate/shared/schema';
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
      .leftJoin('scrapper.createdBy', 'createdBy')
      .leftJoin('scrapper.steps', 'steps')
      .where('scrapper.id = :scrapperId', { scrapperId })
      .andWhere(
        new Brackets((clause) =>
          clause
            .where('scrapper.state IS NULL')
            .orWhere('scrapper.state IN (:...states)', {
              states: completedRunStates,
            })
        )
      )
      .getOneOrFail();
  }

  async findOneByUser(scrapperId: string, userId: string) {
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
      ],
    });
  }

  async getOneByUser(scrapperId: string, userId: string) {
    const scrapper = await this.findOneByUser(scrapperId, userId);

    if (!scrapper) {
      throw new ScrapperNotFoundError();
    }

    return scrapper;
  }
}
