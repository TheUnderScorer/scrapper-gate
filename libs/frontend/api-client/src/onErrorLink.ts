import { onError } from '@apollo/client/link/error';
import { logger } from '@scrapper-gate/frontend/logger';

export const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  graphQLErrors?.forEach(({ message, locations, path }) =>
    logger.error(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
    )
  );

  if (networkError) {
    logger.error(`[Network error]: ${networkError}`);
  }
});
