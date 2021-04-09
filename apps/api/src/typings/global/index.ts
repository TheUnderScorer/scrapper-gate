import '../../../../../typings/global';
import { FastifyInstance } from 'fastify';
import { AwilixContainer } from 'awilix';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      server: FastifyInstance;
      container: AwilixContainer;
    }
  }
}
