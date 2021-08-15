import gql from 'graphql-tag';

export const rootSchema = gql`
  scalar Date
  scalar Url

  # Performs validation of given dto from "@scrapper-gate/shared/validation"
  # "dto" must match existing schema in validation package
  # "key" must match field property to be validated
  # Ex: type Mutation {
  #     // "dto" matches schema export from validation package, key matches field that will be validated
  #     createPost($input: PostInput!) @validateDto(dto: "PostInputDto", key: "input")
  # }
  directive @validateDto(dto: String!, key: String!) on FIELD_DEFINITION

  scalar Record

  input Pagination {
    take: Int!
    skip: Int!
  }

  enum OrderDirection {
    Asc
    Desc
  }

  interface Indexable {
    index: Int!
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
    deletedAt: Date
  }

  interface CreatedBy {
    createdBy: User
  }
`;
