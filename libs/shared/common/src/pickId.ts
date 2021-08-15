import { BaseEntity } from '@scrapper-gate/shared/schema';
import { pick } from 'remeda';

export const pickId = (item?: Pick<BaseEntity, 'id'>) =>
  item ? pick(item, ['id']) : undefined;
