import { authSchema } from './schema/auth';
import { conditionalRulesSchema } from './schema/conditionalRules';
import { errorSchema } from './schema/error';
import { fileSchema } from './schema/file';
import { nodesSchema } from './schema/nodes';
import { rootSchema } from './schema/root';
import { runnerSchema } from './schema/runner';
import { scrapperSchema } from './schema/scrapper';
import { selectorSchema } from './schema/selector';
import { userSchema } from './schema/user';
import { variablesSchema } from './schema/variables';

export const typeDefs = [
  rootSchema,
  fileSchema,
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
