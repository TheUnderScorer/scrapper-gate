import { Indexable, Maybe } from '@scrapper-gate/shared/schema';

export const getNextIndex = (item?: Maybe<Indexable>) =>
  typeof item?.index !== 'number' ? 1 : item.index + 1;
