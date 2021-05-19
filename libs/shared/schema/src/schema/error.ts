import gql from 'graphql-tag';

export const errorSchema = gql`
  interface ErrorObjectInterface {
    name: String!
    message: String
    date: Date!
  }

  type ErrorObject implements ErrorObjectInterface {
    name: String!
    message: String
    date: Date!
  }
`;
