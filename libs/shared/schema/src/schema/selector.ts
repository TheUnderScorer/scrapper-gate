import gql from 'graphql-tag';

export const selectorSchema = gql`
  enum SelectorType {
    Selector
    TextContent
  }

  type Selector {
    type: SelectorType
    value: String!
  }

  input SelectorInput {
    type: SelectorType
    value: String!
  }
`;
