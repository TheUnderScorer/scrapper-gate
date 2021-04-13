import { EntityDefinition } from '@scrapper-gate/backend/database';
import { ScrapperStepModel } from './models/ScrapperStep.model';
import { Entities } from '@scrapper-gate/shared/common';
import { ScrapperStepRepository } from './repositories/ScrapperStep.repository';

export const scrapperStepEntity: EntityDefinition<ScrapperStepModel> = {
  entity: Entities.ScrapperStep,
  repositoryKey: 'scrapperStepRepository',
  model: ScrapperStepModel,
  repository: ScrapperStepRepository,
};
