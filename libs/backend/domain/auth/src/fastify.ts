import 'fastify';
import { UserModel } from '@scrapper-gate/backend/domain/user';

declare module 'fastify' {
  export interface FastifyRequest {
    token?: string;
    user?: UserModel;
  }
}
