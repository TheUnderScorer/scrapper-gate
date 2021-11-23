import gql from 'graphql-tag';

export const variablesSchema = gql`
  scalar VariableValue
  scalar DateOrVariableKey

  enum VariableScope {
    Global
    Scrapper
  }

  enum VariableType {
    Text
    Number
    Date
  }

  type Variable implements BaseEntity {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
    defaultValue: VariableValue
    value: VariableValue
    key: String
    isBuiltIn: Boolean
    scope: VariableScope!
    type: VariableType
  }

  input VariableInput {
    id: ID
    defaultValue: VariableValue
    value: VariableValue
    key: String
    scope: VariableScope!
    type: VariableType
  }
`;
