import { EntityDefinition } from '@scrapper-gate/backend/database';
import { ScrapperModel } from './models/Scrapper.model';
import { Entities } from '@scrapper-gate/shared/common';
import { ScrapperRepository } from './repositories/Scrapper.repository';

export const scrapperEntity: EntityDefinition<ScrapperModel> = {
  model: ScrapperModel,
  entity: Entities.Scrapper,
  repositoryKey: 'scrapperRepository',
  repository: ScrapperRepository,
};
