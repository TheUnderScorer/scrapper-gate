import { BaseEntity } from '@scrapper-gate/shared/schema';
import { v4 } from 'uuid';

export const createBaseEntity = (): BaseEntity => ({
  id: v4(),
  createdAt: new Date(),
  updatedAt: new Date(),
});
