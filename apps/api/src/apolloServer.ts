import { ApolloServer } from 'apollo-server-fastify';
import { Resolvers, typeDefs } from '@scrapper-gate/shared/schema';
import { BaseApolloContent } from '@scrapper-gate/shared-backend/server';
import { AwilixContainer } from 'awilix';

export interface ApolloServerFactoryParams {
  resolvers: Resolvers;
  container: AwilixContainer;
}

export const apolloServerFactory = ({
  resolvers,
  container,
}: ApolloServerFactoryParams) => {
  return new ApolloServer({
    resolvers,
    typeDefs,
    context: (): BaseApolloContent => ({
      container,
      unitOfWork: container.resolve('unitOfWork'),
    }),
    introspection: true,
  });
};
