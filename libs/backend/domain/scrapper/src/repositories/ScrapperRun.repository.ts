import { ensureIdsOrder } from '@scrapper-gate/shared/common';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { ScrapperRunModel } from '../models/ScrapperRun.model';

@EntityRepository(ScrapperRunModel)
export class ScrapperRunRepository extends Repository<ScrapperRunModel> {
  async getLastForScrapper(
    scrapperId: string,
    queryBuilder?: SelectQueryBuilder<ScrapperRunModel>
  ) {
    return this.getLastForScrapperQuery(scrapperId, queryBuilder).getOne();
  }

  async getLastForScrapperWithValues(scrapperId: string) {
    return this.getLastForScrapperQuery(scrapperId)
      .leftJoinAndSelect('scrapperRun.results', 'results')
      .leftJoinAndSelect('results.values', 'values')
      .getOne();
  }

  async findOneOrFailWithScrapper(runId: string) {
    return this.findOneOrFail(runId, {
      relations: ['scrapper'],
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
      scrapperIds.map((scrapperId) => this.getLastForScrapper(scrapperId))
    );

    return ensureIdsOrder(
      models,
      scrapperIds as string[],
      (item) => item?.scrapper.id
    );
  }
}
