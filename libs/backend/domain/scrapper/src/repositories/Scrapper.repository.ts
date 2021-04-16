import { EntityRepository, Repository } from 'typeorm';
import { ScrapperModel } from '../models/Scrapper.model';
import { BaseQueryVariables } from '@scrapper-gate/shared/schema';
import { applyQueryVariables } from '@scrapper-gate/backend/db-utils';

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
      .where('scrapper.userId = :userId', { userId })
      .getManyAndCount();
  }
}
