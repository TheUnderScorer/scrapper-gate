import { AuthTokens } from '@scrapper-gate/shared/domain/auth';
import { RestLink } from 'apollo-link-rest';

export const restLink = (tokens?: AuthTokens) => {
  return new RestLink({
    uri: '',
    endpoints: {
      default: process.env.NX_SECURITY_URL,
    },
    headers: tokens?.accessToken
      ? {
          authorization: `Bearer ${tokens.accessToken}`,
        }
      : undefined,
    bodySerializers: {
      fileEncode: (data: File, headers: Headers) => {
        return { body: data, headers };
      },
    },
  });
};
