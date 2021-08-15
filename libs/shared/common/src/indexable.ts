import { Indexable } from '@scrapper-gate/shared/schema';

export const getNextIndex = (item?: Indexable) =>
  typeof item?.index !== 'number' ? 1 : item.index + 1;
