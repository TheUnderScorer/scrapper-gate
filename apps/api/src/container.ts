import {
  asClass,
  asFunction,
  asValue,
  createContainer as makeContainer,
} from 'awilix';
import fastify from 'fastify';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { asArray } from '@scrapper-gate/backend/awilix';
import { rootResolver } from './resolvers/root.resolver';
import { userResolver } from './resolvers/user/user.resolver';
import { apolloServerFactory } from './apolloServer';
import { ApolloServer } from 'apollo-server-fastify';
import { Connection, createConnection } from 'typeorm';
import { entityDefinitions } from './database';
import { UnitOfWork } from '@scrapper-gate/backend/unit-of-work';
import { SecurityClient } from '@tshio/security-client';
import {
  ExtractToken,
  ExtractUser,
  makeExtractToken,
  makeExtractUser,
} from '@scrapper-gate/backend/domain/auth';
import { ErrorHandler, errorHandler } from '@scrapper-gate/backend/server';
import { makeRepositoriesProviderFromDefinitions } from '@scrapper-gate/backend/database';
import { handlers } from './handlers';
import { UserRepository } from '@scrapper-gate/backend/domain/user';
import { decode } from 'jsonwebtoken';
import { scrapperResolver } from './resolvers/scrapper/scrapper.resolver';

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
    resolvers: asArray([
      asFunction(userResolver),
      asFunction(scrapperResolver),
      asFunction(rootResolver),
    ]),
    apolloServer: asFunction(apolloServerFactory).singleton(),
    container: asValue(container),
    connection: asValue(connection),
    handlers: asValue(handlers),
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
  });

  server.decorateRequest('container', '');

  await container.resolve<ExtractToken>('extractToken')(server);
  await container.resolve<ExtractUser>('extractUser')(server);

  server.get(apiRoutes.health, async () => {
    return {
      alive: true,
    };
  });

  const apolloServer = container.resolve<ApolloServer>('apolloServer');

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
