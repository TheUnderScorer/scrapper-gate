import { EntityDefinition } from '@scrapper-gate/backend/database';
import { fileEntity } from '@scrapper-gate/backend/domain/files';
import {
  scrapperEntity,
  scrapperRunEntity,
  scrapperRunStepResultEntity,
  scrapperRunStepValueEntity,
  scrapperStepEntity,
} from '@scrapper-gate/backend/domain/scrapper';
import { userEntity } from '@scrapper-gate/backend/domain/user';
import { variableEntity } from '@scrapper-gate/backend/domain/variables';

export const entityDefinitions: EntityDefinition[] = [
  userEntity,
  fileEntity,
  scrapperEntity,
  variableEntity,
  scrapperStepEntity,
  scrapperRunEntity,
  scrapperRunStepResultEntity,
  scrapperRunStepValueEntity,
];
