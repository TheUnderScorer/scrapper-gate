import gql from 'graphql-tag';

export const userSchema = gql`
  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String!
  }

  extend type Query {
    me: User
  }
`;
