import { AwilixContainer, Resolver } from 'awilix';

export function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (container: AwilixContainer) =>
      resolvers.map((resolver: Resolver<T>) => container.build(resolver)),
  };
}
