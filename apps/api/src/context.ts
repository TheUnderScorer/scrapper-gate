import { UserModel } from '@scrapper-gate/backend/domain/user';
import { BaseApolloContext } from '@scrapper-gate/backend/server';
import { ServerCqrs } from './cqrs';

export type ServerContext = BaseApolloContext<UserModel, ServerCqrs>;
