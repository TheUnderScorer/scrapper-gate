import { clone, mapValues } from 'remeda';

export const removeTypename = <T>(value: T): T => {
  if (value && typeof value === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = clone(value as any);

    delete target.__typename;

    return mapValues(target, removeTypename);
  }

  return value;
};
