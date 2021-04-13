import { userEntity } from '@scrapper-gate/backend/domain/user';
import { EntityDefinition } from '@scrapper-gate/backend/database';
import {
  scrapperEntity,
  scrapperStepEntity,
} from '@scrapper-gate/backend/domain/scrapper';

export const entityDefinitions: EntityDefinition<unknown>[] = [
  userEntity,
  scrapperEntity,
  scrapperStepEntity,
];
