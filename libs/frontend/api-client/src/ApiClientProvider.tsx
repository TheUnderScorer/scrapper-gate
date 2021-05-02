import React, { PropsWithChildren, useMemo } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  from,
  InMemoryCache,
} from '@apollo/client';
import { useTokensStore } from '@scrapper-gate/frontend/domain/auth';
import { httpLink } from './httpLink';
import { restLink } from './restLink';
import { onErrorLink } from './onErrorLink';
import { removeTypenameLink } from './removeTypenameLink';

export const ApiClientProvider = ({ children }: PropsWithChildren<unknown>) => {
  const tokens = useTokensStore((store) => store.tokens);
  const setTokens = useTokensStore((store) => store.setTokens);

  const client = useMemo(() => {
    return new ApolloClient({
      link: from([
        onErrorLink,
        removeTypenameLink,
        restLink(tokens),
        httpLink(tokens, setTokens),
      ]),
      cache: new InMemoryCache(),
    });
  }, [setTokens, tokens]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
