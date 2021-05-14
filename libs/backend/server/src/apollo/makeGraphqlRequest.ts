import { DocumentNode } from 'graphql';

export const makeGraphqlRequest = <Variables>(
  document: DocumentNode,
  variables?: Variables
) => {
  return {
    query: document.loc.source.body,
    variables,
  };
};
