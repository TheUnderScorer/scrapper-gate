import {
  ApolloClient,
  ApolloProvider,
  from,
  InMemoryCache,
} from '@apollo/client';
import { WithUseTokenStoreHook } from '@scrapper-gate/frontend/domain/auth';
import { DateOrVariableKeyScalar } from '@scrapper-gate/shared/domain/variables';
import { DateScalar, typeDefs } from '@scrapper-gate/shared/schema';
import { withScalars } from 'apollo-link-scalars';
import { makeExecutableSchema } from 'graphql-tools';
import React, { PropsWithChildren, useMemo } from 'react';
import { httpLink } from './httpLink';
import { onErrorLink } from './onErrorLink';
import { restLink } from './restLink';

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

export const ApiClientProvider = ({
  children,
  useTokensStore,
}: PropsWithChildren<WithUseTokenStoreHook>) => {
  const tokens = useTokensStore((store) => store.tokens);
  const setTokens = useTokensStore((store) => store.setTokens);

  const client = useMemo(() => {
    return new ApolloClient({
      link: from([
        onErrorLink,
        withScalars({
          schema: executableSchema,
          typesMap: {
            DateOrVariableKey: DateOrVariableKeyScalar,
            Date: DateScalar,
          },
          removeTypenameFromInputs: true,
        }),
        restLink(tokens),
        httpLink({ tokens, setTokens }),
      ]),
      cache: new InMemoryCache(),
    });
  }, [setTokens, tokens]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
