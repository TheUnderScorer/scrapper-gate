import gql from 'graphql-tag';

export const variablesSchema = gql`
  scalar VariableValue

  type Variable implements BaseEntity {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
    defaultValue: VariableValue
    value: VariableValue
    key: String!
    kind: String
  }

  enum BaseVariableKind {
    BuiltIn
  }

  input VariableInput {
    id: ID
    defaultValue: VariableValue
    value: VariableValue
    key: String!
    kind: String
  }
`;
