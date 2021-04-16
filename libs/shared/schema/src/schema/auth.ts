import gql from 'graphql-tag';

export const authSchema = gql`
  directive @auth on FIELD_DEFINITION

  type AuthTokens {
    accessToken: String!
    refreshToken: String!
  }
`;
