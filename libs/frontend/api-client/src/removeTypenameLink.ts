import { ApolloLink } from '@apollo/client';
import mapValues from 'lodash.mapvalues';

export const removeTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = removeTypename(operation.variables);
  }

  return forward(operation);
});

const removeTypename = <T extends Record<string, unknown>>(obj: T): T => {
  if (typeof obj !== 'object') {
    return obj;
  }

  return mapValues(obj, handle);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handle = (item: any, key: string) => {
  if (key === '__typename') {
    return undefined;
  }

  if (Array.isArray(item)) {
    return item.map((value) => removeTypename(value));
  }

  if (item && typeof item === 'object') {
    return removeTypename(item);
  }

  return item;
};
