import { asArray } from '@scrapper-gate/backend/awilix';
import { cqrsFactory } from '@scrapper-gate/backend/cqrs';
import { makeRepositoriesProviderFromDefinitions } from '@scrapper-gate/backend/database';
import {
  ExtractToken,
  ExtractUser,
  makeExtractToken,
  makeExtractUser,
} from '@scrapper-gate/backend/domain/auth';
import { UserRepository } from '@scrapper-gate/backend/domain/user';
import { ErrorHandler, errorHandler } from '@scrapper-gate/backend/server';
import { UnitOfWork } from '@scrapper-gate/backend/unit-of-work';
import { getEnvironment } from '@scrapper-gate/shared/common';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { SecurityClient } from '@tshio/security-client';
import { ApolloServer } from 'apollo-server-fastify';
import {
  asClass,
  asFunction,
  asValue,
  createContainer as makeContainer,
} from 'awilix';
import fastify from 'fastify';
import { decode } from 'jsonwebtoken';
import { Connection, createConnection } from 'typeorm';
import { v4 } from 'uuid';
import { apolloServerFactory } from '../apolloServer';
import { registerServerCqrs } from '../cqrs';
import { entityDefinitions } from '../database';
import { fileResolver } from '../resolvers/file/file.resolver';
import { rootResolver } from '../resolvers/root.resolver';
import { scrapperResolver } from '../resolvers/scrapper/scrapper.resolver';
import { userResolver } from '../resolvers/user/user.resolver';
import { setupDataLoaders } from './dataLoaders';
import { setupServices } from './services';

export interface CreateContainerDependencies {
  dbConnection?: Connection;
  skipMessageQueueHealthCheck?: boolean;
}

export const createContainer = async ({
  dbConnection,
  skipMessageQueueHealthCheck,
}: CreateContainerDependencies = {}) => {
  const container = makeContainer();
  const securityClient = new SecurityClient({
    port: process.env.SECURITY_PORT ? parseInt(process.env.SECURITY_PORT) : 80,
    host: process.env.SECURITY_HOST ?? 'localhost',
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
    logger: asValue(server.log),
    environment: asValue(getEnvironment()),
  });

  await setupServices(container, skipMessageQueueHealthCheck);
  setupDataLoaders(container);

  container.register({
    port: asValue(port),
    server: asValue(server),
    resolvers: asArray([
      asFunction(userResolver),
      asFunction(scrapperResolver),
      asFunction(rootResolver),
      asFunction(fileResolver),
    ]),
    apolloServer: asFunction(apolloServerFactory).singleton(),
    container: asValue(container),
    connection: asValue(connection),
    repositoriesProvider: asValue(
      makeRepositoriesProviderFromDefinitions(entityDefinitions)
    ),
    unitOfWork: asClass(UnitOfWork).singleton(),
    securityClient: asValue(securityClient),
    extractToken: asFunction(makeExtractToken).singleton(),
    extractUser: asFunction(makeExtractUser).singleton(),
    userRepository: asValue(connection.getCustomRepository(UserRepository)),
    decodeToken: asValue(decode),
    securityApiKey: asValue(securityApiKey),
    errorHandler: asFunction(errorHandler).singleton(),
    cqrsFactory: asFunction(cqrsFactory),
    traceId: asFunction(() => v4()).scoped(),
  });

  registerServerCqrs(container);

  server.decorateRequest('container', '');

  await container.resolve<ExtractToken>('extractToken')(server);
  await container.resolve<ExtractUser>('extractUser')(server);

  server.get(apiRoutes.health, async () => {
    return {
      alive: true,
    };
  });

  const apolloServer = container.resolve<ApolloServer>('apolloServer');

  await apolloServer.start();

  server.addHook('preHandler', async (req) => {
    req.container = container;
  });

  await apolloServer.createHandler({
    path: apiRoutes.graphql,
    cors: true,
  })(server);

  server.setErrorHandler(container.resolve<ErrorHandler>('errorHandler'));

  return container;
};
