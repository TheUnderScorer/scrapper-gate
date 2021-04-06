import {
  asClass,
  asFunction,
  asValue,
  createContainer as makeContainer,
} from 'awilix';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { asArray } from '@scrapper-gate/shared-backend/awilix';
import { userResolver } from './resolvers/user.resolver';
import { apolloServerFactory } from './apolloServer';
import { ApolloServer } from 'apollo-server-fastify';
import { Connection, createConnection } from 'typeorm';
import { repositoriesProvider } from './database';
import { UnitOfWork } from '@scrapper-gate/shared-backend/unit-of-work';

export interface CreateContainerDependencies {
  dbConnection?: Connection;
}

export const createContainer = async ({
  dbConnection,
}: CreateContainerDependencies = {}) => {
  const container = makeContainer();

  const connection =
    dbConnection ??
    (await createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      // TODO Migrations setup
      synchronize: true,
      entities: [],
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
    repositoriesProvider: asValue(repositoriesProvider),
    unitOfWork: asClass(UnitOfWork).singleton(),
  });

  server.decorateRequest('container', '');

  server.register(fastifyCors);

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

  return container;
};
