import { EntityDefinition } from '@scrapper-gate/backend/database';
import { ScrapperRunStepValueModel } from './models/ScrapperRunStepValue.model';
import { Entities } from '@scrapper-gate/shared/common';
import { ScrapperRunStepValueRepository } from './repositories/ScrapperRunStepValue.repository';

export const scrapperRunStepValueEntity: EntityDefinition<ScrapperRunStepValueModel> = {
  model: ScrapperRunStepValueModel,
  entity: Entities.ScrapperRunStepValue,
  repositoryKey: 'scrapperRunStepValueRepository',
  repository: ScrapperRunStepValueRepository,
};
