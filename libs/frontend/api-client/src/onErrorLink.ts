import { onError } from '@apollo/client/link/error';
import { logger } from '@scrapper-gate/shared/logger/console';

export const onErrorLink = onError(
  ({ graphQLErrors, networkError, response }) => {
    logger.error(`[GraphQL errors]`, {
      graphQLErrors,
      networkError,
      response,
    });

    graphQLErrors?.forEach(({ message, locations, path }) =>
      logger.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

    if (networkError) {
      logger.error(`[Network error]: ${networkError}`);
    }
  }
);
