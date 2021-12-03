import { Maybe } from '@scrapper-gate/shared/schema';

export const makeGetFieldName =
  (nodeIndex?: Maybe<number>) => (name?: string) => {
    const base = `items[${nodeIndex}].data`;

    return name ? `${base}.${name}` : base;
  };
