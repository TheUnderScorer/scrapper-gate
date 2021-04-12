import { asValue, NameAndRegistrationPair } from 'awilix';

export const asValueObject = <T extends Record<string, unknown>>(obj: T) => {
  const resolvers: NameAndRegistrationPair<unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    resolvers[key] = asValue(value);
  });

  return resolvers;
};
