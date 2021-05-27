import { errorSchema } from './schema/error';
import { rootSchema } from './schema/root';
import { runnerSchema } from './schema/runner';
import { userSchema } from './schema/user';
import { authSchema } from './schema/auth';
import { scrapperSchema } from './schema/scrapper';
import { selectorSchema } from './schema/selector';
import { nodesSchema } from './schema/nodes';
import { conditionalRulesSchema } from './schema/conditionalRules';
import { variablesSchema } from './schema/variables';

export const typeDefs = [
  rootSchema,
  userSchema,
  authSchema,
  nodesSchema,
  scrapperSchema,
  selectorSchema,
  conditionalRulesSchema,
  runnerSchema,
  errorSchema,
  variablesSchema,
];
