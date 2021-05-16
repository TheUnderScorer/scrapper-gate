import gql from 'graphql-tag';

export const errorSchema = gql`
  type ErrorObject {
    name: String!
    message: String
    date: Date!
  }
`;
