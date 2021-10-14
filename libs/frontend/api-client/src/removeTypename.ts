import { clone, mapValues } from 'remeda';

type Typename = {
  __typename?: string;
};

const hasTypename = (value: unknown): value is Typename => {
  return Boolean(value && typeof value === 'object' && '__typename' in value);
};

export const removeTypename = <T>(value: T): T => {
  if (value && typeof value === 'object') {
    const target = clone(value);

    if (hasTypename(target)) {
      delete (target as Typename).__typename;
    }

    return mapValues(target, (value) => {
      if (Array.isArray(value)) {
        return value.map(removeTypename);
      }

      return removeTypename(value);
    }) as T;
  }

  return value;
};
