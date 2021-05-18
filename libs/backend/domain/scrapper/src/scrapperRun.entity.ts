import { EntityDefinition } from '@scrapper-gate/backend/database';
import { ScrapperRunModel } from './models/ScrapperRun.model';
import { Entities } from '@scrapper-gate/shared/common';
import { ScrapperRunRepository } from './repositories/ScrapperRun.repository';

export const scrapperRunEntity: EntityDefinition<ScrapperRunModel> = {
  model: ScrapperRunModel,
  entity: Entities.ScrapperRun,
  repositoryKey: 'scrapperRunRepository',
  repository: ScrapperRunRepository,
};
