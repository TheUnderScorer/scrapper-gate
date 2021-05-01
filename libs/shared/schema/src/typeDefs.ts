import { rootSchema } from './schema/root';
import { userSchema } from './schema/user';
import { authSchema } from './schema/auth';
import { scrapperSchema } from './schema/scrapper';
import { selectorSchema } from './schema/selector';
import { nodesSchema } from './schema/nodes';

export const typeDefs = [
  rootSchema,
  userSchema,
  authSchema,
  nodesSchema,
  scrapperSchema,
  selectorSchema,
];
