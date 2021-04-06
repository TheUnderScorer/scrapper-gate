import { gql } from 'apollo-server-fastify';

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
`
