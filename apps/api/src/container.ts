import {
  asClass,
  asFunction,
  asValue,
  createContainer as makeContainer,
} from 'awilix';
import fastify from 'fastify';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { asArray } from '@scrapper-gate/shared-backend/awilix';
import { userResolver } from './resolvers/user.resolver';
import { apolloServerFactory } from './apolloServer';
import { ApolloServer } from 'apollo-server-fastify';
import { Connection, createConnection } from 'typeorm';
import { entityDefinitions } from './database';
import { UnitOfWork } from '@scrapper-gate/shared-backend/unit-of-work';
import { SecurityClient } from '@tshio/security-client';
import {
  ExtractToken,
  ExtractUser,
  makeExtractToken,
  makeExtractUser,
} from '@scrapper-gate/shared-backend/domain/auth';
import { errorHandler } from '@scrapper-gate/shared-backend/server';
import { makeRepositoriesProviderFromDefinitions } from '@scrapper-gate/shared-backend/database';

export interface CreateContainerDependencies {
  dbConnection?: Connection;
}

export const createContainer = async ({
  dbConnection,
}: CreateContainerDependencies = {}) => {
  const container = makeContainer();
  const securityClient = new SecurityClient({
    port: process.env.SECURITY_PORT
      ? parseInt(process.env.SECURITY_PORT)
      : undefined,
    host: process.env.SECURITY_HOST,
    https: process.env.SECURITY_HTTPS === 'true',
  });
  const securityApiKey = process.env.SECURITY_API_KEY;

  if (!securityApiKey) {
    throw new TypeError('Security api key is missing.');
  }

  const connection =
    dbConnection ??
    (await createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      // TODO Migrations setup
      synchronize: true,
      entities: entityDefinitions.map((entity) => entity.model),
      type: 'postgres',
    }));

  const port = process.env.PORT || 3000;
  const server = fastify({
    logger: true,
  });

  container.register({
    port: asValue(port),
    server: asValue(server),
    logger: asValue(server.log),
    resolvers: asArray([asFunction(userResolver)]),
    apolloServer: asFunction(apolloServerFactory).singleton(),
    container: asValue(container),
    connection: asValue(connection),
    handlers: asValue({}),
    repositoriesProvider: asValue(
      makeRepositoriesProviderFromDefinitions(entityDefinitions)
    ),
    unitOfWork: asClass(UnitOfWork).singleton(),
    securityClient: asValue(securityClient),
    extractToken: asFunction(makeExtractToken).singleton(),
    extractUser: asFunction(makeExtractUser).singleton(),
  });

  server.decorateRequest('container', '');
  server.decorateRequest('token', '');

  server.get(apiRoutes.health, async () => {
    return {
      alive: true,
    };
  });

  const apolloServer = container.resolve<ApolloServer>('apolloServer');

  server.addHook('preHandler', async (req) => {
    req.container = container;
  });

  server.register(
    apolloServer.createHandler({
      path: apiRoutes.graphql,
      cors: true,
    })
  );

  await container.resolve<ExtractToken>('extractToken')(server);
  await container.resolve<ExtractUser>('extractUser')(server);

  server.setErrorHandler(errorHandler);

  return container;
};
