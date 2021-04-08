import { ApolloServer } from 'apollo-server-fastify';
import { Resolvers, typeDefs } from '@scrapper-gate/shared/schema';
import { BaseApolloContent } from '@scrapper-gate/shared-backend/server';
import { AwilixContainer } from 'awilix';
import { Logger } from '@scrapper-gate/shared/logger';

export interface ApolloServerFactoryParams {
  resolvers: Resolvers;
  container: AwilixContainer;
  logger: Logger;
}

export const apolloServerFactory = ({
  resolvers,
  container,
  logger,
}: ApolloServerFactoryParams) => {
  return new ApolloServer({
    resolvers,
    typeDefs,
    context: (): BaseApolloContent => ({
      container,
      unitOfWork: container.resolve('unitOfWork'),
    }),
    introspection: true,
    formatError: (error) => {
      logger.error('Graphql error:', error);

      return {
        ...error,
        name: error.originalError?.name ?? error.name,
      };
    },
  });
};
