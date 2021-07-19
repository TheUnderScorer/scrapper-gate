import { BaseEntity, Maybe } from '@scrapper-gate/shared/schema';

export const ensureIdsOrder = <T extends BaseEntity>(
  items: Array<Maybe<T>>,
  ids: T['id'][],
  getId?: (item: Maybe<T>) => Maybe<T['id']>
) =>
  ids.map((id) =>
    items.find((item) => (getId ? getId(item) === id : item?.id === id))
  );
