import { BaseEntity, Maybe } from '@scrapper-gate/shared/schema';
import { pick } from 'remeda';

export const pickId = (item?: Maybe<Pick<BaseEntity, 'id'>>) =>
  item ? pick(item, ['id']) : undefined;
