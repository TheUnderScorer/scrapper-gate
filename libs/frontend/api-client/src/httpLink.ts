import { createHttpLink } from '@apollo/client';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { AuthTokens } from '@scrapper-gate/shared/schema';

let refreshTokenPromise: Promise<Response> | null = null;

export const httpLink = (
  tokens: AuthTokens,
  setTokens: (tokens?: AuthTokens) => void,
  fetch = window.fetch
) =>
  createHttpLink({
    uri: `${process.env.NX_API_URL}${apiRoutes.graphql}`,
    fetch: (endpoint: RequestInfo, options?: RequestInit) => {
      const newOptions = {
        ...options,
        headers: {
          ...options?.headers,
          ...(tokens?.accessToken
            ? {
                authorization: `Bearer ${tokens.accessToken}`,
              }
            : undefined),
        },
      };

      return fetch(endpoint, newOptions).then(async (response) => {
        if (
          response.status === 401 &&
          tokens?.accessToken &&
          tokens?.refreshToken
        ) {
          const copyResponse = response.clone();

          const json = await copyResponse.json();

          if (
            json &&
            json.error &&
            json.error.id === 'Invalid token provided'
          ) {
            if (!refreshTokenPromise) {
              refreshTokenPromise = fetch(
                `${process.env.NX_SECURITY_URL}/public/auth/refresh-token`,
                {
                  method: 'POST',
                  headers: newOptions.headers,
                  body: JSON.stringify({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                  }),
                }
              ).then(async (res) => {
                if (res.ok) {
                  const newTokens = await res.json();

                  setTokens({
                    accessToken: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken,
                  });

                  return newTokens.accessToken;
                }

                return null;
              });
            }

            const newToken = await refreshTokenPromise;
            refreshTokenPromise = null;

            if (newToken) {
              return fetch(endpoint, {
                ...newOptions,
                headers: {
                  ...newOptions.headers,
                  authorization: `Bearer ${newToken}`,
                },
              });
            }
          } else {
            setTokens(undefined);

            delete newOptions.headers.authorization;

            return fetch(endpoint, newOptions);
          }
        }

        return response;
      });
    },
  });
