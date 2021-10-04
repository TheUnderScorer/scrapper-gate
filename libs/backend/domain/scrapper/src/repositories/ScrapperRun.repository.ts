import { applyQueryVariables } from '@scrapper-gate/backend/db-utils';
import { ensureIdsOrder } from '@scrapper-gate/shared/common';
import {
  OrderDirection,
  QueryVariablesWithUser,
} from '@scrapper-gate/shared/schema';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { ScrapperRunModel } from '../models/ScrapperRun.model';

@EntityRepository(ScrapperRunModel)
export class ScrapperRunRepository extends Repository<ScrapperRunModel> {
  async getByUser({ userId, ...rest }: QueryVariablesWithUser) {
    const queryBuilder = this.createQueryBuilder('scrapperRun');

    applyQueryVariables({
      queryBuilder,
      alias: 'scrapperRun',
      ...rest,
      order: rest.order ?? {
        column: 'createdAt',
        direction: OrderDirection.Desc,
      },
    });

    return queryBuilder
      .leftJoinAndSelect('scrapperRun.scrapper', 'scrapper')
      .leftJoinAndSelect('scrapperRun.createdBy', 'createdBy')
      .where('createdBy.id = :userId', { userId })
      .getManyAndCount();
  }

  async findLastForScrapper(
    scrapperId: string,
    queryBuilder?: SelectQueryBuilder<ScrapperRunModel>
  ) {
    return this.getLastForScrapperQuery(scrapperId, queryBuilder).getOne();
  }

  async findLastForScrapperWithValues(scrapperId: string) {
    return this.getLastForScrapperQuery(scrapperId)
      .leftJoinAndSelect('scrapperRun.results', 'results')
      .leftJoinAndSelect('results.values', 'values')
      .leftJoinAndSelect('values.screenshot', 'screenshot')
      .getOne();
  }

  async getOneForUser(id: string, userId: string) {
    return this.findOneOrFail({
      where: {
        id,
        createdBy: {
          id: userId,
        },
      },
      relations: [
        'createdBy',
        'scrapper',
        'scrapper.steps',
        'results',
        'results.values',
        'results.values.screenshot',
      ],
    });
  }

  async getOneForRun(runId: string) {
    return this.findOneOrFail(runId, {
      relations: ['scrapper', 'results', 'results.values'],
    });
  }

  private getLastForScrapperQuery(
    scrapperId: string,
    queryBuilder?: SelectQueryBuilder<ScrapperRunModel>
  ) {
    return (queryBuilder ?? this.createQueryBuilder('scrapperRun'))
      .leftJoinAndSelect('scrapperRun.scrapper', 'scrapper')
      .where('scrapper.id = :scrapperId', { scrapperId })
      .orderBy('scrapperRun.createdAt', 'DESC');
  }

  async loadLastForScrappers(scrapperIds: ReadonlyArray<string>) {
    const models = await Promise.all(
      scrapperIds.map((scrapperId) => this.findLastForScrapper(scrapperId))
    );

    return ensureIdsOrder(
      models,
      scrapperIds as string[],
      (item) => item?.scrapper.id
    );
  }
}
