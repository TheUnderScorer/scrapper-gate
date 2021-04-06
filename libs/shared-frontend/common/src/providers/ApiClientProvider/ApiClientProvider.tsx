import React, { PropsWithChildren, useMemo } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useTokensStore } from '@scrapper-gate/shared-frontend/domain/auth';
import { httpLink } from './httpLink';

const cache = new InMemoryCache();

export const ApiClientProvider = ({ children }: PropsWithChildren<unknown>) => {
  const tokens = useTokensStore((store) => store.tokens);
  const setTokens = useTokensStore((store) => store.setTokens);

  const client = useMemo(() => {
    return new ApolloClient({
      link: httpLink(tokens, setTokens),
      cache,
    });
  }, [setTokens, tokens]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
