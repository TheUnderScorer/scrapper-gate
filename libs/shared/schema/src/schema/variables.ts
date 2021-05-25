import gql from 'graphql-tag';

export const variablesSchema = gql`
  scalar VariableValue

  enum VariableScope {
    Global
    Scrapper
    Workflow
  }

  type Variable implements BaseEntity {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
    defaultValue: VariableValue
    value: VariableValue
    key: String!
    kind: String
    isBuiltIn: Boolean
    scope: VariableScope!
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
    scope: VariableScope!
  }
`;
