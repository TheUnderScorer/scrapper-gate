import 'fastify';
import { AwilixContainer } from 'awilix';

declare module 'fastify' {
  export interface FastifyRequest {
    container: AwilixContainer;
    rootContainer: AwilixContainer;
  }
}
