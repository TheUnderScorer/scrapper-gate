import { EntityDefinition } from '@scrapper-gate/backend/database';
import { VariableModel } from './models/Variable.model';
import { Entities } from '@scrapper-gate/shared/common';
import { VariableRepository } from './repositories/Variable.repository';

export const variableEntity: EntityDefinition<VariableModel> = {
  model: VariableModel,
  entity: Entities.Variable,
  repositoryKey: 'variableRepository',
  repository: VariableRepository,
};
