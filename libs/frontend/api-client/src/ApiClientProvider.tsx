import {
  ApolloClient,
  ApolloProvider,
  from,
  InMemoryCache,
} from '@apollo/client';
import { WithUseTokenStoreHook } from '@scrapper-gate/frontend/domain/auth';
import React, { PropsWithChildren, useMemo } from 'react';
import { httpLink } from './httpLink';
import { onErrorLink } from './onErrorLink';
import { removeTypenameLink } from './removeTypenameLink';
import { restLink } from './restLink';

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
        removeTypenameLink,
        restLink(tokens),
        httpLink({ tokens, setTokens }),
      ]),
      cache: new InMemoryCache(),
    });
  }, [setTokens, tokens]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
