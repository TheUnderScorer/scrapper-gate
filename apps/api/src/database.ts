import { userEntity } from '@scrapper-gate/backend/domain/user';
import { EntityDefinition } from '@scrapper-gate/backend/database';
import {
  scrapperEntity,
  scrapperRunEntity,
  scrapperRunStepResultEntity,
  scrapperRunStepValueEntity,
  scrapperStepEntity,
} from '@scrapper-gate/backend/domain/scrapper';

export const entityDefinitions: EntityDefinition<unknown>[] = [
  userEntity,
  scrapperEntity,
  scrapperStepEntity,
  scrapperRunEntity,
  scrapperRunStepResultEntity,
  scrapperRunStepValueEntity,
];
