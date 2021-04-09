import gql from 'graphql-tag';

export const rootSchema = gql`
  scalar Date

  input Pagination {
    take: Int!
    skip: Int!
  }

  enum OrderDirection {
    Asc
    Desc
  }

  input Order {
    direction: OrderDirection!
    column: String!
  }

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
