import gql from 'graphql-tag';

export const authSchema = gql`
  type AuthTokens {
    accessToken: String!
    refreshToken: String!
  }
`;
