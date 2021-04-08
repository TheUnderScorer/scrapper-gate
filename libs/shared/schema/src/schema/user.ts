import gql from 'graphql-tag';

export const userSchema = gql`
  type User implements BaseEntity {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    firstName: String
    lastName: String
    email: String!
  }

  extend type Query {
    me: User
  }
`;
