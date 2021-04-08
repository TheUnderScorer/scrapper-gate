import { rootSchema } from './schema/root';
import { userSchema } from './schema/user';
import { authSchema } from './schema/auth';

export const typeDefs = [rootSchema, userSchema, authSchema];
