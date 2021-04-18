import { onError } from '@apollo/client/link/error';

export const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  graphQLErrors?.forEach(({ message, locations, path }) =>
    console.log(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
    )
  );

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});
