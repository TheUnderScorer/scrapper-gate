import { EntityRepository, Repository } from 'typeorm';
import { ScrapperModel } from '../models/Scrapper.model';
import { BaseQueryVariables } from '@scrapper-gate/shared/schema';
import { applyQueryVariables } from '@scrapper-gate/backend/db-utils';
import { ScrapperNotFoundError } from '@scrapper-gate/shared/errors';

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
