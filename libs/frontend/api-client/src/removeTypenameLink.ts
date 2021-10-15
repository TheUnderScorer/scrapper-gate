import { ApolloLink } from '@apollo/client';
import { removeTypename } from './removeTypename';

export const removeTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = removeTypename(operation.variables);
  }

  return forward(operation);
});
