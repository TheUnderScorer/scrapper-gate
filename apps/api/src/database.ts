import { EntityDefinition } from '@scrapper-gate/backend/database';
import {
  scrapperEntity,
  scrapperRunEntity,
  scrapperRunStepResultEntity,
  scrapperRunStepValueEntity,
  scrapperStepEntity,
} from '@scrapper-gate/backend/domain/scrapper';
import { userEntity } from '@scrapper-gate/backend/domain/user';

export const entityDefinitions: EntityDefinition[] = [
  userEntity,
  scrapperEntity,
  scrapperStepEntity,
  scrapperRunEntity,
  scrapperRunStepResultEntity,
  scrapperRunStepValueEntity,
];
