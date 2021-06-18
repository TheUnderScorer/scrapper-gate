import { asValue, NameAndRegistrationPair, Resolver } from 'awilix';

export const asValueObject = <T extends Record<string, unknown>>(obj: T) => {
  const resolvers: Record<string, Resolver<unknown>> = {};

  Object.entries(obj).forEach(([key, value]) => {
    resolvers[key] = asValue(value);
  });

  return resolvers as NameAndRegistrationPair<unknown>;
};
