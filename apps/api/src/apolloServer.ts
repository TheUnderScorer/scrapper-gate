import { ApolloServer } from 'apollo-server-fastify';
import { Resolvers, typeDefs } from '@scrapper-gate/shared/schema';
import { AwilixContainer } from 'awilix';
import { Logger } from '@scrapper-gate/shared/logger';
import { BaseApolloContext } from '@scrapper-gate/backend/server';

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
    context: ({ request }): BaseApolloContext => ({
      container,
      unitOfWork: container.resolve('unitOfWork'),
      user: request?.user,
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
