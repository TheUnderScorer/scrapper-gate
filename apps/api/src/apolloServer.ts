import { AuthDirective } from '@scrapper-gate/backend/domain/auth';
import { BaseApolloContext } from '@scrapper-gate/backend/server';
import { ValidateDtoDirective } from '@scrapper-gate/backend/validation';
import { Environment } from '@scrapper-gate/shared/common';
import { Logger } from '@scrapper-gate/shared/logger';
import { Resolvers, typeDefs } from '@scrapper-gate/shared/schema';
import { ApolloServer } from 'apollo-server-fastify';
import { AwilixContainer } from 'awilix';
import { makeExecutableSchema } from 'graphql-tools';

export interface ApolloServerFactoryParams {
  resolvers: Resolvers;
  container: AwilixContainer;
  logger: Logger;
  environment: Environment;
}

export const apolloServerFactory = ({
  resolvers,
  container,
  logger,
  environment,
}: ApolloServerFactoryParams) => {
  return new ApolloServer({
    debug: environment === Environment.Development,
    context: ({ request }): BaseApolloContext => ({
      container,
      unitOfWork: container.resolve('unitOfWork'),
      user: request?.user,
    }),
    schema: makeExecutableSchema({
      schemaDirectives: {
        auth: AuthDirective,
        validateDto: ValidateDtoDirective,
      },
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
      typeDefs,
      resolvers,
    }),
    introspection: true,
    formatError: (error) => {
      logger.error(`Graphql error: ${JSON.stringify(error)}`);

      return {
        ...error,
        name: error.originalError?.name ?? error.name,
      };
    },
  });
};
