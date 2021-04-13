import gql from 'graphql-tag';

export const userSchema = gql`
  type User implements BaseEntity {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    firstName: String
    lastName: String
    email: String!
    deletedAt: Date
  }

  input CreateUserInput {
    email: String!
    password: String!
  }

  type CreateUserResult {
    user: User!
    tokens: AuthTokens!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): CreateUserResult!
  }
`;
