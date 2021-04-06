import { gql } from 'apollo-server-fastify';

export const rootSchema = gql`
    type Query {
      _: Boolean
    }

    type Mutation {
      _: Boolean
    }

    type Subscription {
      _: Boolean
    }
`;
