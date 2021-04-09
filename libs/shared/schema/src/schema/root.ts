import gql from 'graphql-tag';

export const rootSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  interface BaseEntity {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
  }
`;
