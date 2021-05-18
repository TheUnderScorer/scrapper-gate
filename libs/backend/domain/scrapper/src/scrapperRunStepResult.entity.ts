import { EntityDefinition } from '@scrapper-gate/backend/database';
import { ScrapperRunStepResultModel } from './models/ScrapperRunStepResult.model';
import { Entities } from '@scrapper-gate/shared/common';
import { ScrapperRunStepResultRepository } from './repositories/ScrapperRunStepResult.repository';

export const scrapperRunStepResultEntity: EntityDefinition<ScrapperRunStepResultModel> = {
  model: ScrapperRunStepResultModel,
  entity: Entities.ScrapperRunStepResult,
  repositoryKey: 'scrapperRunStepResultRepository',
  repository: ScrapperRunStepResultRepository,
};
