import { variableRegex } from './regex';

export const containsVariableKey = (val: unknown): val is string => {
  return typeof val === 'string' && Boolean(val.match(variableRegex)?.length);
};
