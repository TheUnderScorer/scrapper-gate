import { EntityDefinition } from '@scrapper-gate/backend/database';
import { Entities } from '@scrapper-gate/shared/common';
import { FileModel } from './models/File.model';
import { FileRepository } from './repositories/File.repository';

export const fileEntity: EntityDefinition<FileModel> = {
  model: FileModel,
  entity: Entities.File,
  repositoryKey: 'fileRepository',
  repository: FileRepository,
};
